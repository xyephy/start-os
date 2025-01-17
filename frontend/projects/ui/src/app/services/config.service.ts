import { DOCUMENT } from '@angular/common'
import { Inject, Injectable } from '@angular/core'
import { WorkspaceConfig } from '@start9labs/shared'
import {
  InterfaceDef,
  PackageDataEntry,
  PackageMainStatus,
  PackageState,
} from 'src/app/services/patch-db/data-model'

const {
  packageArch,
  osArch,
  gitHash,
  useMocks,
  ui: { api, marketplace, mocks },
} = require('../../../../../config.json') as WorkspaceConfig

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  hostname = this.document.location.hostname
  // includes port
  host = this.document.location.host
  // includes ":" (e.g. "http:")
  protocol = this.document.location.protocol
  version = require('../../../../../package.json').version as string
  useMocks = useMocks
  mocks = mocks
  packageArch = packageArch
  osArch = osArch
  gitHash = gitHash
  api = api
  marketplace = marketplace
  skipStartupAlerts = useMocks && mocks.skipStartupAlerts
  isConsulate = (window as any)['platform'] === 'ios'
  supportsWebSockets = !!window.WebSocket || this.isConsulate

  isTor(): boolean {
    return useMocks ? mocks.maskAs === 'tor' : this.hostname.endsWith('.onion')
  }

  isLocal(): boolean {
    return useMocks
      ? mocks.maskAs === 'local'
      : this.hostname.endsWith('.local')
  }

  isTorHttp(): boolean {
    return this.isTor() && !this.isHttps()
  }

  isLanHttp(): boolean {
    return !this.isTor() && !this.isLocalhost() && !this.isHttps()
  }

  isSecure(): boolean {
    return window.isSecureContext || this.isTor()
  }

  isLaunchable(
    state: PackageState,
    status: PackageMainStatus,
    interfaces: Record<string, InterfaceDef>,
  ): boolean {
    return (
      state === PackageState.Installed &&
      status === PackageMainStatus.Running &&
      hasUi(interfaces)
    )
  }

  launchableURL(pkg: PackageDataEntry): string {
    if (!this.isTor() && hasLocalUi(pkg.manifest.interfaces)) {
      return `https://${lanUiAddress(pkg)}`
    } else {
      return `http://${torUiAddress(pkg)}`
    }
  }

  getHost(): string {
    return this.host
  }

  private isLocalhost(): boolean {
    return useMocks
      ? mocks.maskAs === 'localhost'
      : this.hostname === 'localhost'
  }

  private isHttps(): boolean {
    return useMocks ? mocks.maskAsHttps : this.protocol === 'https:'
  }
}

export function hasTorUi(interfaces: Record<string, InterfaceDef>): boolean {
  const int = getUiInterfaceValue(interfaces)
  return !!int?.['tor-config']
}

export function hasLocalUi(interfaces: Record<string, InterfaceDef>): boolean {
  const int = getUiInterfaceValue(interfaces)
  return !!int?.['lan-config']
}

export function torUiAddress({
  manifest,
  installed,
}: PackageDataEntry): string {
  const key = getUiInterfaceKey(manifest.interfaces)
  return installed ? installed['interface-addresses'][key]['tor-address'] : ''
}

export function lanUiAddress({
  manifest,
  installed,
}: PackageDataEntry): string {
  const key = getUiInterfaceKey(manifest.interfaces)
  return installed ? installed['interface-addresses'][key]['lan-address'] : ''
}

export function hasUi(interfaces: Record<string, InterfaceDef>): boolean {
  return hasTorUi(interfaces) || hasLocalUi(interfaces)
}

export function removeProtocol(str: string): string {
  if (str.startsWith('http://')) return str.slice(7)
  if (str.startsWith('https://')) return str.slice(8)
  return str
}

export function removePort(str: string): string {
  return str.split(':')[0]
}

export function getUiInterfaceKey(
  interfaces: Record<string, InterfaceDef>,
): string {
  return Object.keys(interfaces).find(key => interfaces[key].ui) || ''
}

export function getUiInterfaceValue(
  interfaces: Record<string, InterfaceDef>,
): InterfaceDef | null {
  return Object.values(interfaces).find(i => i.ui) || null
}

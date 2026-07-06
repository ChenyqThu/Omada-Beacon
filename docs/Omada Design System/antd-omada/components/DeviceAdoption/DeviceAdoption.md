# DeviceAdoption

Pending-device adoption flow: discovered devices (model · MAC · IP) walk discovered → adopting → provisioning → connected with a three-dot progress strip and a status chip per row. One demo device (`AP-610`) fails during provisioning the first time; Retry re-runs provisioning only. Adopt all staggers the remaining discovered rows by 300 ms.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `devices` | `{id, model, mac, ip, icon, failOnce?}[]` | 3-device demo set | `icon` is an OmadaIcon name; `failOnce` fails the first provisioning pass |
| `className` | `string` | — | merged onto the root |

## Behaviour

- Timings: adopting 900 ms → provisioning 1300 ms → connected/failed. All timers cleaned up on unmount.
- Chip tones: discovered = neutral, adopting/provisioning = blue with pulsing dot, connected = brand green, failed = red with a Retry button (tooltip explains).
- The header counter shows devices not yet connected; Adopt all disables once nothing is discovered.

## Figma

SYMBOL `25947:11537` ("Adopt 收养"); row metrics follow CertManager list rows. Distinct from FirmwareRollout (staged updates to already-adopted devices) and WanFailover (link state machine).

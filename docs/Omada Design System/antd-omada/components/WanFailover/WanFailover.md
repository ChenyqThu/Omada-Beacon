# WanFailover — `window.Omada.WanFailover`

**Primary / backup WAN link cards + live failover state machine + event timeline.** Normal: primary ACTIVE (pulsing green), backup STANDBY. *Simulate failure* → DETECTING (~1.2 s) → FAILOVER: primary DOWN, backup ACTIVE, timeline gains "link down" + "traffic moved" events. *Restore* plays it back and logs "restored". Events are locale-timestamped, newest first, capped at 8.

Distinct from **SpeedTest** (one link's throughput) and **FirmwareRollout** (staged waves): a two-link redundancy state view.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `primary` / `backup` | `{ name, ip, latency }` | WAN1 Fiber / WAN2 LTE | |
| `onFailover` / `onRestore` | `() => void` | — | After each transition lands. |

## Behaviour
- Phases: `normal → detecting → failover → restoring → normal`; the arrow between cards flips tone with the phase.
- Down links show latency "—"; IPs render LTR mono in RTL; timers cleaned up on unmount.

## Figma
Backup WAN icon SYMBOL `25963:3732` ("icon/icon/Backup WAN"), SD-WAN sidebar icons `25947:9749` (Off) / `27066:119248` (On); WAN1/WAN2 link-card anatomy also appears in the Dynamic DNS illustration `26455:7888`. Cards follow Card tokens, timeline follows AuditTrail metrics.

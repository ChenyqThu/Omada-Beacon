# PacketCapture — `window.Omada.PacketCapture`

A **capture session** panel: interface Select + BPF-style filter Input + start/stop, rolling **packet / byte / duration / file-size** counters while running (200 ms interval, presentational simulation), a pulsing live dot, and a stopped state with a client-side **Download .pcap** stub (valid 24-byte libpcap global header Blob).

Distinct from **SpeedTest** (Batch 26 — staged throughput run machine): this is an open-ended record-then-export session.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `interfaces` | `[{ value, label }]` | WAN1 / LAN / VLAN 20 | Select options. |
| `defaultInterface` | string | first option | |
| `defaultFilter` | string | `''` | Echoed next to the status line while capturing. |
| `onStop` | `({ interface, filter, packets, bytes, seconds }) => void` | — | |

## Behaviour
- States: `idle → running → stopped`; restart relabels the CTA "New capture".
- Counters render LTR in RTL; interval cleaned up on unmount.

## Figma
Icon SYMBOL `25947:11393` ("抓包测试Packet Capture") — no full frame; panel anatomy follows Card/Input tokens.

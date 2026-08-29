# Demo sandbox

Open `/demo/` or select **Try it with sample data** on the landing page.

The demo ships three realistic approved rules:

- `met a pro lol` → `metoprolol` from Clinical notes
- `cube or net ease` → `Kubernetes` from Engineering notes
- `Neem` → `Niamh` from Engineering notes

It opens directly on the Rules view so a visitor sees a working repair book before doing setup. The persistent **Demo** banner offers **Reset demo** and **Start for real**.

Demo browser storage is `demo:drb_web_preview_state`. The ordinary browser preview uses `drb_web_preview_state`; native release builds use the encrypted Tauri vault. The demo never reads or writes either real-data location. Reset restores only the shipped sample state. Start for real deletes the demo state and its demo license keys before returning home.

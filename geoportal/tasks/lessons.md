# Lecciones Aprendidas y Patrones

Este archivo se actualiza tras cualquier corrección del usuario para evitar repetir errores.

## Registro de Lecciones

- **Generación de Imágenes**: La herramienta `generate_image` tiene límites de tasa (rate limits) estrictos. Los intentos de generar múltiples imágenes en paralelo o en rápida sucesión resultan en errores 429 (Too Many Requests) o 503 (Service Unavailable).
  - _Solución_: Generar imágenes una por una con pausas significativas o solicitar al usuario que las proporcione si el volumen es alto. Verificar siempre si la generación fue exitosa antes de intentar mover/copiar archivos.

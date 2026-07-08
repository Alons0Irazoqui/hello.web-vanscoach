# Vans Coach — Landing Page

Informe de proyecto para el desarrollador. Aquí está toda la información del negocio necesaria para construir la landing page sobre la plantilla HTML.

## 1. Sobre el negocio

**Nombre:** Vans Coach
**Rubro:** Agencia de Viajes & Tramitadora
**Logo:** disponible en [`imagenes/logo.jpg`](imagenes/logo.jpg)

### Servicio principal a destacar: Visa de Emergencia

Esta es la única información que el cliente proporcionó sobre su servicio, y debe ser el eje central del contenido de la landing:

- **Visa de emergencia.**
- Dirigido a personas con **familiares en Estados Unidos** que estén en **fase terminal** o **hayan fallecido**.
- **Tiempo de gestión: 3 días** para conseguir la visa.
- El resultado/aprobación depende del **récord de la persona** (historial migratorio/legal).

No hay más información del negocio por el momento. Si al armar el contenido faltan datos (dirección, teléfono, redes sociales, testimonios, precios), dejar placeholders claramente marcados en vez de inventar información.

## 2. Logo

- Ubicación: `imagenes/logo.jpg`
- **Importante:** el logo tiene fondo blanco/sólido y debe procesarse para **quitarle el fondo** antes de usarlo en la web (usar [remove.bg](https://www.remove.bg) o herramienta equivalente) y exportarlo en PNG con transparencia.
- Paleta de referencia que se puede extraer del logo: azul, naranja/dorado y blanco. Usar estos tonos como guía para acentos de color, sin perder el estilo premium pedido abajo.

## 3. Estilo y dirección visual

El resultado final debe transmitir una imagen **premium, enterprise/empresarial, elegante y confiable** — no un diseño genérico de plantilla. Puntos clave a pedirle a Claude:

- Estilo **premium / enterprise**: tipografía cuidada, espaciado generoso, jerarquía visual clara, nada recargado.
- La página debe tener una **pantalla de carga (loading screen)** al inicio, antes de mostrar el contenido principal.
- Uso del logo (ya sin fondo) de forma prominente y consistente en header/hero y footer.
- Diseño responsive, cuidando que se vea igual de bien en mobile.

## 4. Flujo de trabajo con Claude

1. El prompt inicial para adaptar la plantilla al negocio lo voy a proporcionar yo directamente al desarrollador (no es necesario generarlo aquí).
2. Después del prompt inicial, **iterar con Claude** en rondas sucesivas hasta lograr el acabado premium/enterprise deseado — el primer resultado normalmente no será suficiente. Pedir explícitamente:
   - Ajustes de estilo hacia lo empresarial/elegante/premium (colores, tipografía, espaciados, sombras, micro-interacciones).
   - Implementación de la pantalla de carga inicial.
   - Integración del logo sin fondo (remove.bg) en el header/hero/footer.
   - Revisión de responsive y detalles visuales en cada iteración.
3. No conformarse con la primera versión: seguir refinando con prompts de ajuste hasta que el look final sea consistente con una marca premium/enterprise.

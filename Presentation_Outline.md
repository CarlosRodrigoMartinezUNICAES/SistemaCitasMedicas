---
Slide 1: Portada
---
**Nombre del Sistema:** Sistema de Citas Médicas 🩺📅

**Creadores:**
© 2025 | [Tu Nombre Completo] | [tu.correo@ejemplo.com]
© 2025 | [Nombre del Compañero 1] | [compañero1.correo@ejemplo.com]
© 2025 | [Nombre del Compañero 2] | [compañero2.correo@ejemplo.com]
*(Añade o quita líneas según el número de integrantes)*

---
Slide 2: Objetivos
---
**Objetivo General:**
Desarrollar un sistema integral y eficiente para la gestión de citas médicas, optimizando la interacción entre pacientes, médicos y personal administrativo, y facilitando el acceso a la información de salud de manera segura y organizada.

**Objetivos Específicos:**
1.  **Automatizar la Programación de Citas:** Permitir a los pacientes agendar, visualizar y cancelar citas de forma autónoma, y a los médicos gestionar su agenda de manera efectiva.
2.  **Centralizar el Historial Médico:** Proporcionar a los médicos una herramienta para registrar y consultar el historial de consultas de los pacientes, construyendo un registro médico completo a lo largo del tiempo.
3.  **Mejorar la Experiencia del Usuario:** Ofrecer una interfaz intuitiva y responsiva para pacientes y médicos, garantizando una navegación fluida y acceso rápido a las funcionalidades clave.
4.  **Garantizar la Integridad y Seguridad de los Datos:** Implementar mecanismos de validación y seguridad para proteger la información sensible de los pacientes y asegurar la consistencia de los datos.
5.  **Generar Reportes y Estadísticas:** Facilitar la creación de reportes y la visualización de estadísticas para apoyar la toma de decisiones operativas y estratégicas en la clínica.

---
Slide 3: Propuesta (Resumida)
---
El **Sistema de Citas Médicas** es una aplicación web diseñada para modernizar la gestión de clínicas. Ofrece una plataforma intuitiva donde los **pacientes** pueden agendar, ver y cancelar sus citas, así como acceder a su historial médico. Los **médicos**, por su parte, disponen de una vista de calendario para sus citas, herramientas para actualizar el estado de las mismas, registrar nuevas consultas y acceder a la base de datos de pacientes y reportes. Construido con **React** en el frontend y **Node.js/Express** con **MariaDB** en el backend, el sistema prioriza la eficiencia, la integridad de los datos y una experiencia de usuario fluida, sentando las bases para una gestión clínica digital completa.

---
Slide 4: Contribución Técnica / Alcances
---
**Tecnologías Clave:**
*   **Frontend:** React (con Vite para desarrollo rápido), TypeScript, CSS (con Tailwind CSS para estilos responsivos).
*   **Backend:** Node.js con Express.js (TypeScript).
*   **Base de Datos:** MariaDB (gestión de conexiones con `mariadb` client y connection pooling).
*   **Gestión de Dependencias:** npm.

**Alcances del Proyecto:**
*   **Gestión Completa del Ciclo de Vida de la Cita:** Desde la creación por el paciente hasta la confirmación, atención y cancelación por parte del médico o paciente.
*   **Integración de Datos Maestros:** Uso de especialidades médicas desde la base de datos para evitar errores y mejorar la consistencia.
*   **Arquitectura Modular:** Separación clara de responsabilidades entre frontend, backend y base de datos, facilitando el mantenimiento y la escalabilidad.
*   **Manejo de Errores:** Implementación de `try-catch` en el backend y mensajes de error básicos en el frontend.
*   **Conexión a Base de Datos Optimizada:** Uso de connection pooling para una gestión eficiente de los recursos de la base de datos.

**Contribución Técnica Específica:**
*   Implementación de endpoints RESTful para la gestión de usuarios, citas, pacientes, médicos y especialidades.
*   Desarrollo de componentes reutilizables en React para la interfaz de usuario.
*   Configuración de un entorno de desarrollo y producción con Vite y Node.js.
*   Diseño de un esquema de base de datos relacional robusto para soportar las operaciones de la clínica.

---
Slide 5: Requerimientos (Hardware y Software)
---
**Requerimientos de Hardware (Mínimos Sugeridos):**
*   **Procesador:** Dual-core 2.0 GHz o superior.
*   **RAM:** 4 GB (para desarrollo y ejecución local).
*   **Almacenamiento:** 20 GB de espacio libre en disco.
*   **Conexión a Internet:** Necesaria para la instalación de dependencias y acceso a recursos externos.

**Requerimientos de Software (Utilizados al Final):**
*   **Sistema Operativo:** Windows 10/11, macOS (últimas versiones), o distribuciones Linux (Ubuntu, Debian, Fedora, etc.).
*   **Entorno de Ejecución:** Node.js (versión LTS recomendada, ej. 18.x o 20.x).
*   **Gestor de Paquetes:** npm (incluido con Node.js).
*   **Base de Datos:** MariaDB Server (versión 10.x o superior).
*   **Herramientas de Base de Datos (Opcional pero Recomendado):** DBeaver, MySQL Workbench o similar para gestión visual.
*   **Navegador Web:** Google Chrome, Mozilla Firefox, Microsoft Edge o Safari (últimas versiones).
*   **Editor de Código:** Visual Studio Code (recomendado) o cualquier IDE compatible con JavaScript/TypeScript.
*   **Control de Versiones:** Git.

---
Slide 6: Diseño Lógico de Datos
---
**Diagrama Relacional (UML de Clase / ERD):**
*(**Aquí se debe insertar el Diagrama de Clases UML o un Diagrama Entidad-Relación (ERD) de la base de datos.** Este diagrama debe reflejar las tablas `Usuario`, `Paciente`, `Doctor`, `Especialidad`, `Cita`, `Consulta` y `Horario_Doctor`, junto con sus atributos y relaciones. Asegúrate de que esté actualizado con cualquier cambio que haya surgido durante el desarrollo.)*

**Descripción del Esquema de Base de Datos:**
El diseño de la base de datos se centra en la eficiencia y la integridad de los datos, utilizando un modelo relacional normalizado.

*   **`Usuario`:** Tabla central para la autenticación, almacena información básica del usuario y su rol (`Paciente`, `Doctor`, `Admin`).
*   **`Paciente`:** Extiende la información del `Usuario` para roles de paciente, incluyendo datos demográficos y de contacto.
*   **`Doctor`:** Extiende la información del `Usuario` para roles de doctor, vinculando a una `Especialidad` y almacenando la licencia médica.
*   **`Especialidad`:** Catálogo de especialidades médicas disponibles.
*   **`Cita`:** Registra cada cita agendada, vinculando a un `Paciente` y un `Doctor`, con detalles de fecha, hora, estado y motivo.
*   **`Consulta`:** Almacena los registros de las consultas médicas realizadas, incluyendo diagnóstico, tratamiento y notas, vinculadas a una `Cita`.
*   **`Horario_Doctor`:** Permite definir la disponibilidad de cada doctor por día y rango horario.

**Relaciones Clave:**
*   `Usuario` tiene una relación 1-a-1 con `Paciente` y `Doctor` (a través de `id_usuario`).
*   `Doctor` tiene una relación N-a-1 con `Especialidad`.
*   `Cita` tiene relaciones N-a-1 con `Paciente` y `Doctor`.
*   `Consulta` tiene una relación N-a-1 con `Cita`.
*   `Horario_Doctor` tiene una relación N-a-1 con `Doctor`.

**Diagrama de Casos de Uso:**
*(**Aquí se debe insertar el Diagrama de Casos de Uso del sistema.** Este diagrama debe ilustrar las interacciones de los actores (Paciente, Doctor, Administrador) con las funcionalidades clave del sistema, como "Agendar Cita", "Ver Historial Médico", "Gestionar Citas", etc. Asegúrate de que esté actualizado.)*

---
Slide 7: Interfaz Gráfica del Sistema
---
**Principios de Diseño:**
*   **Moderno y Profesional:** Inspirado en la tipografía Inter y un diseño limpio para una experiencia visual agradable.
*   **Intuitivo:** Navegación clara y flujos de trabajo lógicos para minimizar la curva de aprendizaje.
*   **Responsivo:** Adaptable a diferentes tamaños de pantalla (escritorio, tablet, móvil) para accesibilidad universal.
*   **Centrado en el Usuario:** Diseño enfocado en las necesidades específicas de pacientes y médicos.

**Elementos Clave de la UI:**
*   **Login/Registro:** Formularios claros y seguros.
*   **Dashboard de Paciente:** Vista de citas próximas, historial y perfil.
*   **Formulario de Agendar Cita:** Selección de especialidad (dropdown desde DB), fecha y hora.
*   **Dashboard de Doctor:** Calendario de citas, lista de pacientes, acceso a reportes.
*   **Gestión de Citas (Doctor):** Dropdown inline para cambiar el estado de las citas.
*   **Historial Médico:** Visualización estructurada de consultas pasadas.

**Capturas de Pantalla / Demostración Visual:**
*(**Aquí se deben insertar capturas de pantalla de las interfaces más relevantes del sistema.** Incluye vistas del login, dashboard de paciente, formulario de agendar cita, dashboard de doctor, gestión de citas y historial médico. Si es posible, muestra la responsividad del diseño.)*

---
Slide 8: Explicación y Ejecución Funcional del Sistema
---
**Demostración en Vivo:**
*(**Aquí se realizará una demostración en vivo del sistema.** Se recomienda seguir un flujo de usuario típico para cada rol.)*

**Flujo de Demostración Sugerido:**
1.  **Login:** Iniciar sesión como Paciente.
2.  **Agendar Cita:**
    *   Navegar al formulario de agendar cita.
    *   Seleccionar una especialidad del dropdown (demostrar que carga de la DB).
    *   Elegir fecha y hora.
    *   Confirmar la cita.
3.  **Ver Citas (Paciente):**
    *   Mostrar la cita recién agendada.
    *   Demostrar la funcionalidad de **cancelación de cita** por parte del paciente.
4.  **Login:** Iniciar sesión como Doctor.
5.  **Ver Citas (Doctor):**
    *   Mostrar el calendario o lista de citas.
    *   Localizar la cita agendada previamente.
    *   Demostrar el cambio de estado de la cita (ej. de "Pendiente" a "Confirmada", luego a "Atendida").
6.  **Ver Historial Médico (Paciente desde Doctor):**
    *   Acceder a la lista de pacientes.
    *   Seleccionar un paciente y ver su historial de consultas.
7.  **Generación de Reportes (Doctor):**
    *   Mostrar la interfaz de reportes y explicar qué tipo de datos se pueden visualizar.

**Procedimientos Almacenados en la Base de Datos:**
Hemos implementado procedimientos almacenados para encapsular lógica de negocio compleja y mejorar la seguridad/rendimiento.

1.  **`RegistrarPaciente`:**
    *   **Función:** Gestiona el registro de un nuevo paciente, creando entradas tanto en la tabla `Usuario` (con rol 'Paciente') como en la tabla `Paciente`.
    *   **Beneficio:** Asegura la consistencia de los datos al registrar un nuevo usuario-paciente y simplifica la lógica en el backend.
    *   **Demostración:** *(Si es posible, mostrar cómo se invoca o explicar su rol en el flujo de registro.)*

2.  **`ObtenerCitasDoctorPorFecha`:**
    *   **Función:** Recupera todas las citas programadas para un doctor específico en una fecha determinada, incluyendo detalles relevantes del paciente.
    *   **Beneficio:** Optimiza la consulta de la agenda del doctor, reduciendo la complejidad de las queries en el backend.
    *   **Demostración:** *(Explicar cómo esta SP alimenta la vista de calendario/citas del doctor.)*

3.  **`ObtenerHistorialMedicoPaciente`:**
    *   **Función:** Compila y devuelve el historial completo de consultas médicas para un paciente dado, uniendo información de citas, doctores y especialidades.
    *   **Beneficio:** Proporciona una vista consolidada y eficiente del historial médico del paciente.
    *   **Demostración:** *(Explicar cómo esta SP se utiliza para mostrar el historial en la interfaz del paciente o del doctor.)*

**Triggers y sus Funciones:**
*(**No se han implementado triggers en el archivo `procedimientos_almacenados.sql` revisado.** Si se han añadido triggers en otra parte o se planea hacerlo, descríbelos aquí. De lo contrario, puedes mencionar que no se utilizaron triggers en esta fase del desarrollo y explicar por qué (ej. la lógica se maneja en el backend o con SPs).)*

---
Slide 9: Conclusiones
---
El **Sistema de Citas Médicas** representa una base sólida y funcional para la digitalización de la gestión clínica. Hemos logrado implementar las funcionalidades críticas que permiten un ciclo de vida completo de las citas y una gestión básica de pacientes y médicos. La elección de tecnologías modernas y una arquitectura bien definida nos ha permitido construir un sistema robusto, escalable y fácil de mantener. Aunque existen áreas para futuras mejoras, el sistema está listo para una fase de piloto, demostrando el potencial de optimizar significativamente las operaciones diarias de una clínica.

**Logros Destacados:**
*   Gestión eficiente del ciclo de vida de las citas.
*   Interfaz de usuario intuitiva y responsiva.
*   Integración de datos maestros para mayor consistencia.
*   Uso de procedimientos almacenados para optimizar operaciones de DB.

---
Slide 10: Referencias (Formato APA)
---
*(**Aquí se deben listar todas las referencias utilizadas en el proyecto, siguiendo el formato APA.** Incluye documentación de librerías, frameworks, artículos, etc. A continuación, se presentan ejemplos de referencias comunes que podrías incluir.)*

**Ejemplos de Referencias:**

*   MariaDB Foundation. (n.d.). *MariaDB Documentation*. Recuperado de [https://mariadb.com/kb/en/documentation/](https://mariadb.com/kb/en/documentation/)
*   Node.js. (n.d.). *Node.js Documentation*. Recuperado de [https://nodejs.org/en/docs/](https://nodejs.org/en/docs/)
*   React. (n.d.). *React Documentation*. Recuperado de [https://react.dev/](https://react.dev/)
*   Vite. (n.d.). *Vite Documentation*. Recuperado de [https://vitejs.dev/](https://vitejs.dev/)
*   Express. (n.d.). *Express.js Documentation*. Recuperado de [https://expressjs.com/](https://expressjs.com/)
*   TypeScript. (n.d.). *TypeScript Documentation*. Recuperado de [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)
*   Tailwind CSS. (n.d.). *Tailwind CSS Documentation*. Recuperado de [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
*   (Si utilizaste alguna librería específica de UI, como Material-UI, Ant Design, etc., inclúyela aquí).
*   (Cualquier libro, artículo académico o recurso en línea que haya influido en el diseño o la implementación).

---
Slide 11: Cierre
---
**¡Gracias por su atención!**

**Preguntas y Comentarios**

---
Slide 12: Creadores
---
**Desarrollado por:**

© 2025 | [Tu Nombre Completo] | [tu.correo@ejemplo.com]
© 2025 | [Nombre del Compañero 1] | [compañero1.correo@ejemplo.com]
© 2025 | [Nombre del Compañero 2] | [compañero2.correo@ejemplo.com]
*(Asegúrate de que esta información sea precisa y completa para cada miembro del equipo.)*

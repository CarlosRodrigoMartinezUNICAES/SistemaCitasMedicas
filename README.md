# Sistema de Citas Médicas 🩺📅

Pequeña app para gestionar citas clínicas — frontend con React + Vite y esquema de base de datos en MariaDB.  
Visual, simple y lista para expandir.

---

## ✨ Características

- 💻 Interfaz moderna (React + Vite)  
- 🗓️ Gestión de citas, pacientes y médicos  
- 🗄️ Esquema SQL para MariaDB incluido  
- 🎨 Tipografía Inter para una experiencia visual profesional

---

## 🧰 Tecnologías

- ⚛️ React  
- ⚡ Vite  
- 🐬 MariaDB (script en repo)  
- 🎨 Inter Font (Google Fonts)

---

## 🚀 Rápido arranque

Abrir carpeta cliente:

```bash
cd client
```

Instalar y correr:

```bash
npm install
npm run dev
```

---

## 🖋️ Tipografía

El proyecto utiliza la fuente **Inter** de Google Fonts para proporcionar una experiencia visual moderna y profesional, similar a Figma.  
La fuente se carga automáticamente y está configurada como la fuente principal en todo el proyecto.

---

## 🤝 Contribuir

PRs bienvenidos.  
Crea un ISSUE antes de realizar cambios grandes.

---

## 🧾 Notas

Añade un archivo LICENSE si quieres especificar licencia.  
El archivo `.env` ya está incluido, solo asegúrate de tener las credenciales correctas de MariaDB.

---

## 📚 Documentación Completa
Para una descripción exhaustiva de la funcionalidad del proyecto, arquitectura técnica, especificaciones de la API y diseño de la base de datos, consulta el archivo [FUNCTIONAL_AND_TECHNICAL_SPEC.md](FUNCTIONAL_AND_TECHNICAL_SPEC.md).

---

## ⚙️ Guía de instalación completa

A continuación se detallan los pasos para configurar el proyecto en Windows, Linux o macOS.

### 🔧 1. Instalar requisitos básicos

#### Windows

1. Instala **MariaDB** desde [https://mariadb.org/download](https://mariadb.org/download).
   - Durante la instalación usa:
     - Usuario: `root`
     - Contraseña: `oracle`
2. Instala **Node.js** desde [https://nodejs.org](https://nodejs.org) (versión LTS recomendada).
3. Instala **DBeaver** desde [https://dbeaver.io/download](https://dbeaver.io/download) para manejar la base de datos visualmente.

#### Linux (Debian, Ubuntu, etc.)

```bash
sudo apt update
sudo apt install mariadb-server mariadb-client
sudo systemctl enable mariadb
sudo systemctl start mariadb
sudo mysql_secure_installation
```

Cuando pida contraseña, usa:
- Usuario: `root`
- Contraseña: `oracle`

Luego instala Node.js:

```bash
sudo apt install nodejs npm
```

Y DBeaver:

```bash
sudo snap install dbeaver-ce
```

#### macOS

Instala **Homebrew** si no lo tienes:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Luego:

```bash
brew install mariadb node
brew services start mariadb
brew install --cask dbeaver-community
```

---

### 🗄️ 2. Crear la base de datos

1. Abre **DBeaver** o la consola de MariaDB.
2. Conéctate como:
   - Usuario: `root`
   - Contraseña: `oracle`
3. Crea la base:

```sql
CREATE DATABASE SistemaCitasMedicas;
```

4. Abre el archivo SQL del proyecto (por ejemplo `database.sql`) y ejecútalo en DBeaver o consola:

```sql
USE SistemaCitasMedicas;
SOURCE ruta/al/archivo/database.sql;
```

---

### 💻 3. Clonar el proyecto

Abre una terminal y ejecuta:

```bash
git clone https://github.com/usuario/SistemaCitasMedicas.git
cd SistemaCitasMedicas
```

---

### ⚙️ 4. Variables de entorno

El archivo `.env` ya está configurado en el proyecto.  
Solo asegúrate de que tu usuario `root` de MariaDB tenga la contraseña `oracle` y exista la base `SistemaCitasMedicas`.

---

### 🧩 5. Instalar dependencias

#### Cliente (React + Vite)

```bash
cd client
npm install
```

#### Servidor (Node.js + Express)

```bash
cd ../server
npm install
```

---

### ▶️ 6. Ejecutar el sistema

En dos terminales separadas:

**Terminal 1 — Servidor**

```bash
cd server
npm run dev
```

**Terminal 2 — Cliente**

```bash
cd client
npm run dev
```

Luego abre en tu navegador:

```
http://localhost:5173
```

---

### 🧠 7. (Opcional) Verificar la base de datos

Abre **DBeaver** y confirma que las tablas se hayan creado correctamente dentro de `SistemaCitasMedicas`.

---

## 📜 Licencia

Este proyecto se distribuye bajo la siguiente licencia:

**Copyright (c) 2025 Carlos Rodrigo Martínez Ruiz**

- Uso libre para fines personales o educativos.
- Prohibido el uso comercial o empresarial sin autorización.
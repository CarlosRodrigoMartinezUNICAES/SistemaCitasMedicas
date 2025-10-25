interface ChatbotMessage {
  message: string;
  type: string;
  // Add other properties if known, e.g., id, sender, etc.
}

interface ChatbotState {
  messages: ChatbotMessage[];
  // Add other state properties if known
}

class ActionProvider {
  private createChatBotMessage: (message: string, options?: any) => ChatbotMessage;
  private setState: (updater: (prevState: ChatbotState) => ChatbotState) => void;

  constructor(createChatBotMessage: (message: string, options?: any) => ChatbotMessage, setStateFunc: (updater: (prevState: ChatbotState) => ChatbotState) => void) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  // General Handlers
  handleLoginInfo = () => {
    const message = this.createChatBotMessage(
      "Para iniciar sesión, dirígete a la página principal y haz clic en 'Acceder como Paciente' o 'Acceder como Doctor'. Luego, ingresa tu usuario y contraseña."
    );
    this.updateChatbotState(message);
  };

  handleRegisterInfo = () => {
    const message = this.createChatBotMessage(
      "Para registrarte, dirígete a la página principal y haz clic en 'Regístrate ahora'. Podrás elegir entre registrarte como Paciente o Doctor."
    );
    this.updateChatbotState(message);
  };

  handleLandingPageInfo = () => {
    const message = this.createChatBotMessage(
      "La página de inicio te permite elegir si deseas acceder como Paciente o Doctor, o registrarte si aún no tienes una cuenta."
    );
    this.updateChatbotState(message);
  };

  // Patient Handlers
  handlePatientAppointmentsInfo = () => {
    const message = this.createChatBotMessage(
      "En la sección 'Mis Citas' (Panel de Paciente), puedes ver tus citas agendadas y cancelar las que estén pendientes o confirmadas. Primero, inicia sesión como paciente."
    );
    this.updateChatbotState(message);
  };

  handlePatientMedicalHistoryInfo = () => {
    const message = this.createChatBotMessage(
      "En 'Historial Médico' (Panel de Paciente), encontrarás un registro de tus consultas anteriores. Primero, inicia sesión como paciente."
    );
    this.updateChatbotState(message);
  };

  handlePatientProfileInfo = () => {
    const message = this.createChatBotMessage(
      "En 'Mi Perfil' (Panel de Paciente), puedes ver y actualizar tu información personal, como teléfono, correo y DUI. Primero, inicia sesión como paciente."
    );
    this.updateChatbotState(message);
  };

  handleScheduleAppointmentInfo = () => {
    const message = this.createChatBotMessage(
      "Para agendar una nueva cita, inicia sesión como paciente y busca la opción 'Agendar Nueva Cita'. Podrás seleccionar especialidad, doctor, fecha y hora."
    );
    this.updateChatbotState(message);
  };

  // Doctor Handlers
  handleDoctorCalendarInfo = () => {
    const message = this.createChatBotMessage(
      "El 'Calendario' (Panel de Doctor) te muestra tus estadísticas y un calendario con tus citas. Primero, inicia sesión como doctor."
    );
    this.updateChatbotState(message);
  };

  handleDoctorAppointmentsInfo = () => {
    const message = this.createChatBotMessage(
      "En 'Citas' (Panel de Doctor), puedes gestionar tus citas, filtrar por paciente, cambiar estados y añadir consultas. Primero, inicia sesión como doctor."
    );
    this.updateChatbotState(message);
  };

  handleDoctorPatientsInfo = () => {
    const message = this.createChatBotMessage(
      "En 'Pacientes' (Panel de Doctor), puedes ver y buscar en tu lista de pacientes. Primero, inicia sesión como doctor."
    );
    this.updateChatbotState(message);
  };

  handleDoctorReportsInfo = () => {
    const message = this.createChatBotMessage(
      "En 'Reportes' (Panel de Doctor), puedes ver diversas estadísticas y reportes sobre tus citas y pacientes. Primero, inicia sesión como doctor."
    );
    this.updateChatbotState(message);
  };

  // Fallback and Options
  handleUnknown = () => {
    const message = this.createChatBotMessage("Lo siento, no entiendo tu pregunta. Por favor, intenta de nuevo o escribe 'ayuda' para ver las opciones disponibles.");
    this.updateChatbotState(message);
  };

  displayGeneralOptions = () => {
    const optionsMessage = this.createChatBotMessage(
      "Aquí tienes una guía de comandos que puedes usar:\n\n" +
      "Escribe 'ayuda paciente' para ver comandos específicos para pacientes.\n" +
      "Escribe 'ayuda doctor' para ver comandos específicos para doctores.\n\n" +
      "Comandos Generales:\n" +
      "  ➡️ 'sesion' o 'login': Información sobre cómo iniciar sesión.\n" +
      "  ➡️ 'registro' o 'registrar': Información sobre cómo registrarte.\n" +
      "  ➡️ 'inicio' o 'home': Información sobre la página principal.\n\n" +
      "Escribe 'ayuda' nuevamente para ver esta lista."
    );
    this.updateChatbotState(optionsMessage);
  };

  displayPatientOptions = () => {
    const optionsMessage = this.createChatBotMessage(
      "Comandos para Pacientes:\n\n" +
      "   appointments: 🗓️ 'citas paciente' o 'mis citas': Ver y cancelar tus citas.\n" +
      "  history: 🩺 'historial paciente' o 'historial medico': Ver tu historial médico.\n" +
      "  profile: 👤 'perfil paciente' o 'mi perfil': Ver y editar tu perfil.\n" +
      "  schedule: ➕ 'agendar cita': Agendar una nueva cita.\n\n" +
      "Escribe 'ayuda' para ver la lista completa de comandos."
    );
    this.updateChatbotState(optionsMessage);
  };

  displayDoctorOptions = () => {
    const optionsMessage = this.createChatBotMessage(
      "Comandos para Doctores:\n\n" +
      "  calendar: 📅 'calendario doctor' o 'mi calendario': Ver tu calendario y estadísticas.\n" +
      "  appointments: 📝 'citas doctor' o 'gestionar citas': Gestionar tus citas.\n" +
      "  patients: 🧑‍⚕️ 'pacientes doctor' o 'mis pacientes': Ver tu lista de pacientes.\n" +
      "  reports: 📊 'reportes doctor' o 'mis reportes': Ver tus reportes y estadísticas.\n\n" +
      "Escribe 'ayuda' para ver la lista completa de comandos."
    );
    this.updateChatbotState(optionsMessage);
  };

  updateChatbotState = (message: ChatbotMessage) => {
    this.setState((prevState: ChatbotState) => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  };
}

export default ActionProvider;

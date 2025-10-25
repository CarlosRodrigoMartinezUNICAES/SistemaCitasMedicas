class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message) {
    const lowerCaseMessage = message.toLowerCase();

    if (lowerCaseMessage.includes("ayuda paciente")) {
      this.actionProvider.displayPatientOptions();
    } else if (lowerCaseMessage.includes("ayuda doctor")) {
      this.actionProvider.displayDoctorOptions();
    } else if (lowerCaseMessage.includes("ayuda") || lowerCaseMessage.includes("comandos") || lowerCaseMessage.includes("opciones")) {
      this.actionProvider.displayGeneralOptions();
    } else if (lowerCaseMessage.includes("sesion") || lowerCaseMessage.includes("login")) {
      this.actionProvider.handleLoginInfo();
    } else if (lowerCaseMessage.includes("registro") || lowerCaseMessage.includes("registrar")) {
      this.actionProvider.handleRegisterInfo();
    } else if (lowerCaseMessage.includes("inicio") || lowerCaseMessage.includes("home")) {
      this.actionProvider.handleLandingPageInfo();
    } else if (lowerCaseMessage.includes("citas paciente") || lowerCaseMessage.includes("mis citas")) {
      this.actionProvider.handlePatientAppointmentsInfo();
    } else if (lowerCaseMessage.includes("historial paciente") || lowerCaseMessage.includes("historial medico")) {
      this.actionProvider.handlePatientMedicalHistoryInfo();
    } else if (lowerCaseMessage.includes("perfil paciente") || lowerCaseMessage.includes("mi perfil")) {
      this.actionProvider.handlePatientProfileInfo();
    } else if (lowerCaseMessage.includes("agendar cita")) {
      this.actionProvider.handleScheduleAppointmentInfo();
    } else if (lowerCaseMessage.includes("calendario doctor") || lowerCaseMessage.includes("mi calendario")) {
      this.actionProvider.handleDoctorCalendarInfo();
    } else if (lowerCaseMessage.includes("citas doctor") || lowerCaseMessage.includes("gestionar citas")) {
      this.actionProvider.handleDoctorAppointmentsInfo();
    } else if (lowerCaseMessage.includes("pacientes doctor") || lowerCaseMessage.includes("mis pacientes")) {
      this.actionProvider.handleDoctorPatientsInfo();
    } else if (lowerCaseMessage.includes("reportes doctor") || lowerCaseMessage.includes("mis reportes")) {
      this.actionProvider.handleDoctorReportsInfo();
    } else {
      this.actionProvider.handleUnknown();
    }
  }
}

export default MessageParser;

// constants/Theme.ts
import { StyleSheet } from "react-native";

export const Colors = {
  background: "#FFF8E7",    //Fondo de las pantallas
  primary: "#800020",       //Color principal
  text: "#2C2C2C",          //Texto principal  
  inputBackground: "#fff",  //Fondo de los campos de texto
  borderColor: "#81A619",   //Color de bordes
  secondary: "#D4AF37",     // Color secundario (por ejemplo, textos menos importantes, detalles)
  button: "#1C1C1C",        // Color botones 
};

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: Colors.text,
    fontFamily: "System",
  },
  input: {
    backgroundColor: Colors.inputBackground,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    color: Colors.text,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: Colors.text,
    fontFamily: "System",
  },
  picker: {
    backgroundColor: Colors.inputBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.button,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

  
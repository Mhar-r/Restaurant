import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableHighlight,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { useAuth } from "../hooks/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { GlobalStyles, Colors } from "@/constants/Theme";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false); // Estado para la visibilidad de la contraseña

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://192.168.1.77:8000/api/login", {
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

      const { token, user } = response.data;
      await login(token, user);

      if (user.role_id === 1) router.replace("/admin");
      else if (user.role_id === 2) router.replace("/cashier");
      else if (user.role_id === 3) router.replace("/client");
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        Alert.alert("Error", error.response.data.message);
      } else {
        Alert.alert("Error", "Ocurrió un error inesperado. Intenta de nuevo.");
      }
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Iniciar Sesión</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={GlobalStyles.input}
      />

      {/* Campo de contraseña con ícono para mostrar/ocultar */}
      <View style={{ position: "relative" }}>
        <TextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword} // Cambiar entre visible/oculta según el estado
          style={GlobalStyles.input}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={{ position: "absolute", right: 10, top: 15 }}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"} // Cambia entre "ojo" y "ojo tachado"
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      {/* Botón de Ingresar */}
      <TouchableHighlight
        underlayColor={Colors.secondary} // Color al presionar (por ejemplo del theme)
        style={{
          backgroundColor: Colors.button,
          borderRadius: 8,
          padding: 15,
          marginTop: 30,
        }}
        onPress={handleLogin}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          Ingresar
        </Text>
      </TouchableHighlight>

      {/* Link pequeño para ir al Login */}
      <TouchableOpacity onPress={() => router.replace("/register")}>
        <Text
          style={{ marginTop: 10, color: Colors.primary, textAlign: "center" }}
        >
          ¿No tienes una cuenta? Regístrate
        </Text>
      </TouchableOpacity>
    </View>
  );
}

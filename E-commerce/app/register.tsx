// app/(auth)/register.tsx
import { useState } from "react";
import { View, Text, TextInput, Alert,TouchableOpacity, TouchableHighlight } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

import { GlobalStyles, Colors } from "../constants/Theme"; // cambia la ruta según tu estructura

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false); // Estado para la visibilidad de la contraseña
  const [confirmPassword, setConfirmPassword] = useState("");


  const handleRegister = async () => {

    // Validar que las contraseñas coincidan
  if (password !== confirmPassword) {
    Alert.alert("Error", "Las contraseñas no coinciden.");
    return;
  }

  // Validar criterios de contraseña
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    Alert.alert(
      "Error",
      "La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un número."
    );
    return;
  }

    try {
      await axios.post("http://192.168.1.77:8000/api/register", {
        name,
        email,
        phone,
        password,
        role_id: 3, // Cliente por defecto
      });

      Alert.alert("¡Registro exitoso!", "Ahora puedes iniciar sesión.");
      router.replace("/login");
    } catch (error) {
      Alert.alert("Error", "No se pudo registrar. Revisa los datos.");
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Registro</Text>
      <TextInput
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
        style={GlobalStyles.input}
      />
  
    
      <TextInput
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        style={GlobalStyles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
  
      <TextInput
        placeholder="Teléfono"
        value={phone}
        onChangeText={setPhone}
        style={GlobalStyles.input}
        keyboardType="phone-pad"
      />
  
      <View style={{ position: "relative" }}>
        <TextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={GlobalStyles.input}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={{ position: "absolute", right: 10, top: 15 }}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View>
      <View style={{ position: "relative" }}>
      <TextInput
        placeholder="Confirmar Contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={!showPassword}
        style={GlobalStyles.input}
      />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={{ position: "absolute", right: 10, top: 15 }}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View>
  
  
      {/* Botón de Registrar */}
      <TouchableHighlight
        underlayColor={Colors.secondary} // Color al presionar (por ejemplo del theme)
        style={{ backgroundColor: Colors.button, borderRadius: 8, padding: 15, marginTop: 30, }}
        onPress={handleRegister}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 16, fontWeight: "bold" }}>
          Registrarse
        </Text>
      </TouchableHighlight>
  
      {/* Link pequeño para ir al Login */}
      <TouchableOpacity onPress={() => router.replace('/login')}>
        <Text style={{ marginTop: 10, color: Colors.primary, textAlign: 'center' }}>
          ¿Ya tienes una cuenta? Inicia Sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
}

import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking
} from "react-native";
import { useAuth } from "../context/auth";
import { Stack, useRouter } from "expo-router";
import { useRef, useState } from "react";

export default function SignIn() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [isValid, setIsValid] = useState(false);

  const emailRef = useRef("");
  const passwordRef = useRef("");
  return (
    <>
      <Stack.Screen options={{ title: "sign up", headerShown: false }} />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image source={require('../../assets/images/logo.png')} style={{width: 185, height: 80}} />
        <View style={{ marginTop: 32 }}>
          <Text
            style={{ fontWeight: "500", fontSize: 20 }}
            onPress={() => router.push("/sign-up")}
          >
            Logis Firma
          </Text>
        </View>
        <View style={{ marginTop: 10, marginBottom: 20 }}>
          <Text
            style={{ fontWeight: "500" }}
            onPress={() => router.push("/sign-up")}
          >
            Ingresa a tu cuenta
          </Text>
        </View>
        <View>
          <Text style={styles.label}>Usuario</Text>
          <TextInput
            placeholder="usuario.empresa"
            placeholderTextColor="lightgray"
            autoCapitalize="none"
            nativeID="email"
            onChangeText={(text) => {
              emailRef.current = text;
            }}
            style={styles.textInput}
          />
        </View>
        <View>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            placeholder="contraseña"
            placeholderTextColor="lightgray"
            secureTextEntry={true}
            nativeID="password"
            onChangeText={(text) => {
              passwordRef.current = text;
            }}
            style={styles.textInput}
          />
        </View>

        {isValid ? (
        <View style={{ marginTop: 5}} nativeID="error">
        <Text
          style={{ fontWeight: "500", color: "red" }}
        >
          Usuario o contraseña incorrectos
        </Text>
      </View>
      ) : null}

        <TouchableOpacity
          onPress={async () => {
            const { data, error } = await signIn(
              emailRef.current,
              passwordRef.current
            );
            if (data) {
              router.replace("/");
            } else {
              setIsValid(true);
            }
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Ingresar</Text>
        </TouchableOpacity>
        <View style={{ marginTop: 32 }}>
          <Text
            style={{ fontWeight: "500" }}
            onPress={() => router.push("/sign-up")}
          >
            ¿No tienes una cuenta? Registrate
          </Text>
        </View>
        <View style={styles.contact}>
          <TouchableOpacity onPress={() => { Linking.openURL('https://twitter.com/LogisERP')}} style={{ marginTop: 30 }}>
            <Image source={require('../../assets/images/twitter.png')} style={{width: 20, height: 20}}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { Linking.openURL('https://www.facebook.com/LogisERP')}} style={{ marginTop: 30 }}>
            <Image source={require('../../assets/images/facebook.png')} style={{width: 20, height: 20}}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { Linking.openURL('https://www.youtube.com/channel/UCvNVc3ZO0eaDEr6V3Q1UvIg')}} style={{ marginTop: 30 }}>
            <Image source={require('../../assets/images/youtube.png')} style={{width: 20, height: 20}}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { Linking.openURL('https://api.whatsapp.com/send?phone=3229235880&text=Hola,%20deseo%20recibir%20m%C3%A1s%20informaci%C3%B3n%20de%20Logis')}} style={{ marginTop: 30 }}>
            <Image source={require('../../assets/images/whatsapp.png')} style={{width: 20, height: 20}}/>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 20 }}>
          <Text
            style={{ fontWeight: "500" }}
          >
            © Logis ERP 2023
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 4,
    color: "#1973e7",
  },
  textInput: {
    width: 250,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#1973e7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#1973e7",
    padding: 10,
    width: 250,
    borderRadius: 5,
    marginTop: 16,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  logo: {
    width: 50,
    height: 50,
  },
  contact: {
    width: 200,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  }
});

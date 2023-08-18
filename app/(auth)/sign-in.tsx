import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Image
} from "react-native";
import { useAuth } from "../context/auth";
import { Stack, useRouter } from "expo-router";
import { useRef } from "react";

export default function SignIn() {
  const { signIn } = useAuth();
  const router = useRouter();

  const emailRef = useRef("");
  const passwordRef = useRef("");
  return (
    <>
      <Stack.Screen options={{ title: "sign up", headerShown: false }} />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image source={require('../../assets/images/logo.png')}
       style={{width: 155, height: 70}} />
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

        <TouchableOpacity
          onPress={async () => {
            const { data, error } = await signIn(
              emailRef.current,
              passwordRef.current
            );
            if (data) {
              router.replace("/");
            } else {
              console.log(error);
              // Alert.alert("Login Error", resp.error?.message);
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
});

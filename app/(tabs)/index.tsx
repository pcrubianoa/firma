import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import SignatureCapture from '@/components/SignatureCapture';
import { Text, View } from '@/components/Themed';
import { useAuth } from '../context/auth';


export default function TabOneScreen() {
  console.log('TabOneScreen');
  const { signOut } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Esperando documento para firmar</Text>
      <Text style={styles.subtitle}>Envia el documento a firmar desde Logis</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text onPress={() => signOut()}>Salir</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 15,
    marginVertical: 20,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

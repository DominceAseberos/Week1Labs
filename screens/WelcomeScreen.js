import { Button, StyleSheet, Text, View } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Week1Labs</Text>
        <Text>Welcome to my task app.</Text>
      </View>

      <View style={styles.footer}>
        <Button
          title="View My Tasks"
          onPress={() => navigation.navigate('AddTask')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
});

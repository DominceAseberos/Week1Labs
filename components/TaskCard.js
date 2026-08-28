import { StyleSheet, Text, View } from 'react-native';

export default function TaskCard({ title, done }) {
  return (
    <View style={styles.card}>
      <Text>{title}</Text>
      <Text>{done ? 'Done' : 'Pending'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 12,
    marginBottom: 10,
  },
});

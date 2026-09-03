import { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TaskCard from '../components/TaskCard';

export default function AddTaskScreen() {
  const [taskText, setTaskText] = useState('');
  const [tasks, setTasks] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [quote, setQuote] = useState("Loading today's motivation...");

  useEffect(() => {
    // Load saved tasks once when the screen opens.
    const loadTasks = async () => {
      try {
        const savedData = await AsyncStorage.getItem('tasks');

        if (savedData !== null) {
          setTasks(JSON.parse(savedData));
        }
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadTasks();
  }, []);

  useEffect(() => {
    // Do not overwrite saved tasks before loading finishes.
    if (!isLoaded) return;

    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
      } catch (error) {
        console.error('Failed to save tasks:', error);
      }
    };

    saveTasks();
  }, [tasks, isLoaded]);

  useEffect(() => {
    // Load one quote when the screen opens.
    fetch('https://api.quotable.io/random')
      .then((response) => response.json())
      .then((data) => setQuote(data.content))
      .catch(() => setQuote('Believe in yourself and get it done!'));
  }, []);

  function handleAddTask() {
    // Stop empty tasks from being added.
    if (taskText.trim() === '') {
      setErrorMessage('Please type a task before adding it.');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: taskText,
      done: false,
    };

    setTasks([...tasks, newTask]);
    setTaskText('');
    setErrorMessage('');
  }

  function handleToggleTask(id) {
    // Toggle only the task that was tapped.
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.quote}>💬 {quote}</Text>

      <Button
        title="New Quote"
        onPress={() => {
          fetch('https://api.quotable.io/random')
            .then((response) => response.json())
            .then((data) => setQuote(data.content));
        }}
      />

      <Text style={styles.heading}>Add a Task</Text>

      <TextInput
        style={styles.input}
        placeholder="What do you need to do?"
        value={taskText}
        onChangeText={setTaskText}
      />

      {errorMessage !== '' && (
        <Text style={styles.error}>{errorMessage}</Text>
      )}

      <Button title="Add Task" onPress={handleAddTask} />

      <Text style={styles.count}>You have {tasks.length} task(s)</Text>

      {tasks.length > 0 && tasks.every((task) => task.done) && (
        <Text style={styles.celebration}>🎉 All done! Great work!</Text>
      )}

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard
            title={item.title}
            done={item.done}
            onToggle={() => handleToggleTask(item.id)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No tasks yet — add one above! 👆</Text>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  quote: {
    fontStyle: 'italic',
    color: '#6B7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 10,
    marginBottom: 10,
  },
  error: {
    color: '#B23A48',
    marginBottom: 10,
  },
  count: {
    marginVertical: 16,
  },
  celebration: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E8A7A',
    textAlign: 'center',
    marginVertical: 12,
  },
  empty: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 24,
  },
  separator: {
    height: 8,
  },
  list: {
    flex: 1,
  },
});

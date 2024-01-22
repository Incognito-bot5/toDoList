import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import Sound from "react-native-sound";
import Task from "./components/Task";

export default function App() {
  const [task, setTask] = useState("");
  const [taskItems, setTaskItems] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  /*const handleAddTask = () => {
    Keyboard.dismiss();
    setTaskItems([...taskItems, task]);
    setTask(null);
  };

  const completeTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy);
  };*/
  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(taskItems));
      await AsyncStorage.setItem(
        "completedTasks",
        JSON.stringify(completedTasks)
      );
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  };

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      const storedCompletedTasks = await AsyncStorage.getItem("completedTasks");

      if (storedTasks) {
        setTaskItems(JSON.parse(storedTasks));
      }

      if (storedCompletedTasks) {
        setCompletedTasks(JSON.parse(storedCompletedTasks));
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const playSound = () => {
    const sound = new Sound(
      "task_completed.mp3",
      Sound.MAIN_BUNDLE,
      (error) => {
        if (error) {
          console.log("Error loading sound", error);
          return;
        }
        sound.play(() => {
          sound.release();
        });
      }
    );
  };

  const handleAddTask = () => {
    Keyboard.dismiss();
    if (task.trim() !== "") {
      setTaskItems([...taskItems, task]);
      setTask("");
    }
  };

  const completeTask = (index) => {
    const updatedTasks = [...taskItems];
    const completedTask = updatedTasks.splice(index, 1)[0];
    setTaskItems(updatedTasks);
    setCompletedTasks([...completedTasks, completedTask]);
    playSound();
    saveTasks();
  };

  return (
    <View style={styles.container}>
      {/* Added this scroll view to enable scrolling when list gets longer than the page */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Today's Tasks */}
        <View style={styles.tasksWrapper}>
          <Text style={styles.sectionTitle}>Today's tasks</Text>
          <View style={styles.items}>
            {/* This is where the tasks will go! */}
            {taskItems.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => completeTask(index)}
                >
                  <Task text={item} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View style={styles.completedTasksWrapper}>
          <Text style={styles.sectionTitle}>Completed tasks</Text>
          <View style={styles.items}>
            {completedTasks.map((item, index) => (
              <Task key={index} text={item} />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Write a task */}
      {/* Uses a keyboard avoiding view which ensures the keyboard does not cover the items on screen */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
      >
        <TextInput
          style={styles.input}
          placeholder={"Write a task"}
          value={task}
          onChangeText={(text) => setTask(text)}
        />
        <TouchableOpacity onPress={() => handleAddTask()}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8EAED",
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    borderRadius: 60,
    borderColor: "#C0C0C0",
    borderWidth: 1,
    width: 250,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#C0C0C0",
    borderWidth: 1,
  },
  addText: {},
  completedTasksWrapper: {
    marginTop: 20,
  },
});

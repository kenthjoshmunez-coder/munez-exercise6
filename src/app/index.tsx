import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { questions } from "../questions";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const [authScreen, setAuthScreen] = useState<
    "login" | "register" | "setup" | "app"
  >("login");

  if (authScreen === "login") return <Login setAuthScreen={setAuthScreen} />;
  if (authScreen === "register")
    return <Register setAuthScreen={setAuthScreen} />;
  if (authScreen === "setup") return <Setup setAuthScreen={setAuthScreen} />;

  return <QuizApp />;
}

function Login({ setAuthScreen }: any) {
  const { control, handleSubmit } = useForm();

  const onSubmit = () => setAuthScreen("app");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Controller
        control={control}
        name="email"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Email"
            style={styles.input}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setAuthScreen("register")}>
        <Text>Go to Register</Text>
      </TouchableOpacity>
    </View>
  );
}

function Register({ setAuthScreen }: any) {
  const { control, handleSubmit, watch } = useForm();
  const password = watch("password");

  const onSubmit = () => setAuthScreen("setup");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <Controller
        control={control}
        name="email"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Email"
            style={styles.input}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="confirm"
        rules={{
          validate: (value) => value === password,
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry
            style={styles.input}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.btnText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

function Setup({ setAuthScreen }: any) {
  const { control, handleSubmit } = useForm();

  const onSubmit = () => setAuthScreen("app");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Setup Account</Text>

      <Controller
        control={control}
        name="firstName"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="First Name"
            style={styles.input}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="lastName"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Last Name"
            style={styles.input}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="photo"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Profile Photo URL"
            style={styles.input}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.btnText}>Finish Setup</Text>
      </TouchableOpacity>
    </View>
  );
}

function QuizApp() {
  const { colors, toggleTheme } = useTheme();
  const [screen, setScreen] = useState<"home" | "quiz" | "result">("home");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [showAnswer, setShowAnswer] = useState(false);

  const current = questions[index];

  const selectAnswer = (choice: string) => {
    setAnswers({ ...answers, [current.id]: choice });
    setShowAnswer(true);
  };

  const next = () => {
    if (index < questions.length - 1) {
      setIndex(index + 1);
      setTimeLeft(90);
      setShowAnswer(false);
    } else {
      calculateScore();
      setScreen("result");
    }
  };

  const previous = () => {
    if (index > 0) {
      setIndex(index - 1);
      setTimeLeft(90);
      setShowAnswer(false);
    }
  };

  const calculateScore = useCallback(() => {
    let s = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.answer) s++;
    });
    setScore(s);
    if (s > highScore) setHighScore(s);
  }, [answers, highScore]);

  const startQuiz = () => {
    setIndex(0);
    setAnswers({});
    setScore(0);
    setTimeLeft(90);
    setShowAnswer(false);
    setScreen("quiz");
  };

  useEffect(() => {
    if (screen !== "quiz") return;

    if (timeLeft === 0) {
      if (index < questions.length - 1) {
        setIndex(index + 1);
        setTimeLeft(90);
        setShowAnswer(false);
      } else {
        calculateScore();
        setScreen("result");
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, screen, index, calculateScore]);

  const themeStyles = getThemedStyles(colors);

  if (screen === "home") {
    return (
      <View style={[themeStyles.container]}>
        <Text style={[themeStyles.title]}>📘 Quiz App</Text>
        <TouchableOpacity style={[themeStyles.button]} onPress={startQuiz}>
          <Text style={[themeStyles.btnText]}>Start Quiz</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[themeStyles.themeToggleBtn]}
          onPress={toggleTheme}
        >
          <Text style={[themeStyles.themeToggleBtnText]}>🌙 Toggle Theme</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (screen === "result") {
    return (
      <View style={[themeStyles.container]}>
        <Text style={[themeStyles.title]}>Results</Text>
        <Text style={[themeStyles.scoreText]}>Your Score: {score}</Text>
        <Text style={[themeStyles.scoreText]}>Highest Score: {highScore}</Text>
        <TouchableOpacity style={[themeStyles.button]} onPress={startQuiz}>
          <Text style={[themeStyles.btnText]}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[themeStyles.themeToggleBtn]}
          onPress={toggleTheme}
        >
          <Text style={[themeStyles.themeToggleBtnText]}>🌙 Toggle Theme</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[themeStyles.container]}>
      <View style={themeStyles.headerRow}>
        <View>
          <Text style={[themeStyles.progress]}>
            Question {index + 1} / {questions.length}
          </Text>
        </View>
        <TouchableOpacity onPress={toggleTheme}>
          <Text style={themeStyles.themeToggleBtnSmall}>🌙</Text>
        </TouchableOpacity>
      </View>

      <Text style={[themeStyles.timeLeft]}>
        Time Left: {Math.floor(timeLeft / 60)}:
        {(timeLeft % 60).toString().padStart(2, "0")}
      </Text>

      <Text style={[themeStyles.question]}>{current.question}</Text>

      {Object.keys(current.choices).map((key) => (
        <TouchableOpacity
          key={key}
          style={[
            themeStyles.choice,
            showAnswer &&
              key === current.answer && {
                backgroundColor: colors.correct,
              },
            showAnswer &&
              answers[current.id] === key &&
              key !== current.answer && {
                backgroundColor: colors.incorrect,
              },
          ]}
          onPress={() => selectAnswer(key)}
        >
          <Text style={[themeStyles.choiceText]}>
            {key}. {current.choices[key as keyof typeof current.choices]}
          </Text>
        </TouchableOpacity>
      ))}

      {showAnswer && (
        <Text style={[themeStyles.correctAnswer]}>
          Correct Answer: {current.answer}
        </Text>
      )}

      <View style={themeStyles.row}>
        <TouchableOpacity style={[themeStyles.smallBtn]} onPress={previous}>
          <Text style={[themeStyles.smallBtnText]}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[themeStyles.smallBtn]} onPress={next}>
          <Text style={[themeStyles.smallBtnText]}>
            {index === questions.length - 1 ? "Finish" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function getThemedStyles(colors: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: colors.title,
      marginBottom: 30,
    },
    progress: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 10,
    },
    question: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.title,
      marginBottom: 20,
      textAlign: "center",
    },
    choice: {
      padding: 14,
      backgroundColor: colors.input,
      borderRadius: 10,
      width: "100%",
      marginVertical: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    choiceText: {
      fontSize: 16,
      color: colors.inputText,
    },
    button: {
      backgroundColor: colors.button,
      paddingVertical: 14,
      paddingHorizontal: 50,
      borderRadius: 30,
    },
    btnText: {
      color: colors.buttonText,
      fontSize: 18,
      fontWeight: "bold",
    },
    row: {
      flexDirection: "row",
      marginTop: 25,
      width: "100%",
    },
    smallBtn: {
      flex: 1,
      backgroundColor: colors.input,
      padding: 12,
      borderRadius: 10,
      alignItems: "center",
      marginHorizontal: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    smallBtnText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.title,
    },
    scoreText: {
      fontSize: 20,
      color: colors.text,
      marginVertical: 8,
    },
    input: {
      borderWidth: 1,
      padding: 10,
      marginVertical: 8,
      width: "100%",
      borderRadius: 5,
      borderColor: colors.border,
      color: colors.inputText,
    },
    themeToggleBtn: {
      marginTop: 20,
      backgroundColor: colors.button,
      padding: 10,
      borderRadius: 20,
      paddingHorizontal: 20,
    },
    themeToggleBtnText: {
      color: colors.buttonText,
      fontSize: 16,
      fontWeight: "600",
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      marginBottom: 10,
    },
    themeToggleBtnSmall: {
      fontSize: 24,
    },
    timeLeft: {
      fontSize: 16,
      color: colors.text,
      marginBottom: 10,
    },
    correctAnswer: {
      marginTop: 10,
      color: colors.correct,
      fontWeight: "600",
    },
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1A237E",
    marginBottom: 30,
  },
  progress: { fontSize: 14, color: "#5C6BC0", marginBottom: 10 },
  question: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0D47A1",
    marginBottom: 20,
    textAlign: "center",
  },
  choice: {
    padding: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    width: "100%",
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#BBDEFB",
  },
  choiceText: { fontSize: 16, color: "#1A237E" },
  button: {
    backgroundColor: "#1976D2",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
  },
  btnText: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
  row: { flexDirection: "row", marginTop: 25, width: "100%" },
  smallBtn: {
    flex: 1,
    backgroundColor: "#E3F2FD",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 10,
  },
  smallBtnText: { fontSize: 16, fontWeight: "600", color: "#0D47A1" },
  scoreText: { fontSize: 20, color: "#1A237E", marginVertical: 8 },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 8,
    width: "100%",
    borderRadius: 5,
  },
});

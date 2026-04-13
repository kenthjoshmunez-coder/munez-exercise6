import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { googleWebClientId } from "../config/firebaseConfig";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { questions } from "../questions";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  const [authScreen, setAuthScreen] = useState<
    "login" | "register" | "setup" | "app"
  >("login");

  useEffect(() => {
    if (user && !user.displayName) {
      setAuthScreen("setup");
    } else if (user) {
      setAuthScreen("app");
    }
  }, [user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    if (authScreen === "login") return <Login setAuthScreen={setAuthScreen} />;
    if (authScreen === "register")
      return <Register setAuthScreen={setAuthScreen} />;
  }

  if (user && authScreen === "setup")
    return <Setup setAuthScreen={setAuthScreen} />;

  return <QuizApp />;
}

function Login({ setAuthScreen }: any) {
  const { loginWithEmail, error, loading } = useAuth();
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: googleWebClientId,
    scopes: ["profile", "email"],
  });

  useEffect(() => {
    if (response?.type === "success") {
      Alert.alert(
        "Google Sign-In",
        "Google Sign-In integration requires Firebase configuration. Please set up Google OAuth in your Firebase console and configure the Web Client ID.",
      );
    }
  }, [response]);

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setLoginError("Please fill in all fields");
      return;
    }
    try {
      setLoginError("");
      await loginWithEmail(email, password);
    } catch (err: any) {
      setLoginError(err.message || "Login failed");
    }
  };

  const themeStyles = getThemedStyles(colors);

  return (
    <View style={[themeStyles.container]}>
      <Text style={[themeStyles.title]}>Login</Text>

      {(loginError || error) && (
        <Text
          style={[
            themeStyles.errorText,
            { color: colors.incorrect, marginBottom: 10 },
          ]}
        >
          {loginError || error}
        </Text>
      )}

      <TextInput
        placeholder="Email"
        style={[themeStyles.input]}
        placeholderTextColor={colors.placeholder}
        onChangeText={setEmail}
        value={email}
        editable={!loading}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={[themeStyles.input]}
        placeholderTextColor={colors.placeholder}
        onChangeText={setPassword}
        value={password}
        editable={!loading}
      />

      <TouchableOpacity
        style={[themeStyles.button, loading && { opacity: 0.6 }]}
        onPress={handleEmailLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.buttonText} />
        ) : (
          <Text style={[themeStyles.btnText]}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[themeStyles.googleButton]}
        onPress={() => promptAsync()}
        disabled={!request || loading}
      >
        <Text style={[themeStyles.googleButtonText]}>🔐 Login with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setAuthScreen("register")}>
        <Text style={{ color: colors.title, marginTop: 20 }}>
          No account? Go to Register
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function Register({ setAuthScreen }: any) {
  const { registerWithEmail, error, loading } = useAuth();
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [registerError, setRegisterError] = useState("");

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: googleWebClientId,
    scopes: ["profile", "email"],
  });

  useEffect(() => {
    if (response?.type === "success") {
      Alert.alert(
        "Google Sign-Up",
        "Google Sign-In integration requires Firebase configuration. Please set up Google OAuth.",
      );
    }
  }, [response]);

  const handleRegister = async () => {
    if (!email || !password || !confirm) {
      setRegisterError("Please fill in all fields");
      return;
    }
    if (password !== confirm) {
      setRegisterError("Passwords do not match");
      return;
    }
    try {
      setRegisterError("");
      await registerWithEmail(email, password);
    } catch (err: any) {
      setRegisterError(err.message || "Registration failed");
    }
  };

  const themeStyles = getThemedStyles(colors);

  return (
    <View style={[themeStyles.container]}>
      <Text style={[themeStyles.title]}>Register</Text>

      {(registerError || error) && (
        <Text
          style={[
            themeStyles.errorText,
            { color: colors.incorrect, marginBottom: 10 },
          ]}
        >
          {registerError || error}
        </Text>
      )}

      <TextInput
        placeholder="Email"
        style={[themeStyles.input]}
        placeholderTextColor={colors.placeholder}
        onChangeText={setEmail}
        value={email}
        editable={!loading}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={[themeStyles.input]}
        placeholderTextColor={colors.placeholder}
        onChangeText={setPassword}
        value={password}
        editable={!loading}
      />

      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        style={[themeStyles.input]}
        placeholderTextColor={colors.placeholder}
        onChangeText={setConfirm}
        value={confirm}
        editable={!loading}
      />

      <TouchableOpacity
        style={[themeStyles.button, loading && { opacity: 0.6 }]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.buttonText} />
        ) : (
          <Text style={[themeStyles.btnText]}>Register</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[themeStyles.googleButton]}
        onPress={() => promptAsync()}
        disabled={!request || loading}
      >
        <Text style={[themeStyles.googleButtonText]}>
          🔐 Sign Up with Google
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setAuthScreen("login")}>
        <Text style={{ color: colors.title, marginTop: 20 }}>
          Already have an account? Go to Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function Setup({ setAuthScreen }: any) {
  const { user, saveUserProfile, error, loading: authLoading } = useAuth();
  const { colors } = useTheme();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [setupError, setSetupError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSetup = async () => {
    if (!firstName || !lastName) {
      setSetupError("Please fill in first and last name");
      return;
    }
    if (!user) {
      setSetupError("User not authenticated");
      return;
    }

    try {
      setLoading(true);
      setSetupError("");
      await saveUserProfile({
        firstName,
        lastName,
        photoURL: photoURL || undefined,
        email: user.email || "",
        uid: user.uid,
      });
      setAuthScreen("app");
    } catch (err: any) {
      setSetupError(err.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const themeStyles = getThemedStyles(colors);

  return (
    <View style={[themeStyles.container]}>
      <Text style={[themeStyles.title]}>Setup Account</Text>

      {(setupError || error) && (
        <Text
          style={[
            themeStyles.errorText,
            { color: colors.incorrect, marginBottom: 10 },
          ]}
        >
          {setupError || error}
        </Text>
      )}

      <TextInput
        placeholder="First Name"
        style={[themeStyles.input]}
        placeholderTextColor={colors.placeholder}
        onChangeText={setFirstName}
        value={firstName}
        editable={!loading && !authLoading}
      />

      <TextInput
        placeholder="Last Name"
        style={[themeStyles.input]}
        placeholderTextColor={colors.placeholder}
        onChangeText={setLastName}
        value={lastName}
        editable={!loading && !authLoading}
      />

      <TextInput
        placeholder="Profile Photo URL (optional)"
        style={[themeStyles.input]}
        placeholderTextColor={colors.placeholder}
        onChangeText={setPhotoURL}
        value={photoURL}
        editable={!loading && !authLoading}
      />

      <TouchableOpacity
        style={[
          themeStyles.button,
          (loading || authLoading) && { opacity: 0.6 },
        ]}
        onPress={handleSetup}
        disabled={loading || authLoading}
      >
        {loading || authLoading ? (
          <ActivityIndicator color={colors.buttonText} />
        ) : (
          <Text style={[themeStyles.btnText]}>Finish Setup</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

function QuizApp() {
  const { colors, toggleTheme } = useTheme();
  const { logout } = useAuth();
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
        <TouchableOpacity
          style={[
            themeStyles.button,
            {
              marginTop: 15,
              backgroundColor: colors.incorrect,
              paddingVertical: 10,
              paddingHorizontal: 30,
            },
          ]}
          onPress={() => {
            logout().catch(console.error);
          }}
        >
          <Text style={[themeStyles.btnText]}>Logout</Text>
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
        <TouchableOpacity
          style={[
            themeStyles.button,
            {
              marginTop: 15,
              backgroundColor: colors.incorrect,
              paddingVertical: 10,
              paddingHorizontal: 30,
            },
          ]}
          onPress={() => {
            logout().catch(console.error);
          }}
        >
          <Text style={[themeStyles.btnText]}>Logout</Text>
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
    googleButton: {
      marginTop: 12,
      backgroundColor: colors.input,
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      width: "100%",
      alignItems: "center",
    },
    googleButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.title,
    },
    errorText: {
      fontSize: 14,
      marginBottom: 10,
      textAlign: "center",
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

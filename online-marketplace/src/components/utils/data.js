import supabase from "./supabase";

const registerUser = async (email, password, username) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  if (data.length > 0) {
    return {
      success: false,
      message: "User email already exists",
    };
  }

  const usernameData = await supabase
    .from("users")
    .select("*")
    .eq("username", username);

  if (usernameData.error != null) {
    return {
      success: false,
      message: errorUsername.message,
    };
  }

  if (usernameData.data.length > 0) {
    return {
      success: false,
      message: "Username already exists",
    };
  }

  const authResponse = await supabase.auth.signUp({
    email,
    password,
    username,
  });

  if (authResponse.error != null) {
    return {
      success: false,
      message: authResponse.error.message,
    };
  }

  if (authResponse.data.user.email !== null) {
    const addMetaResponse = await supabase
      .from("users")
      .insert([{ userId: authResponse.data.user.id, username, email, password }]);

    if (addMetaResponse.error) {
      return {
        success: false,
        message: addMetaResponse.error.message,
      };
    }

    return {
      success: true,
      ...addMetaResponse.data,
    };
  }
};

const loginUser = async (email, password, username) => {
  const authResponse = await supabase.auth.signInWithPassword({
    username,
    email,
    password,
  });

  if (authResponse.error) {
    return {
      success: false,
      error: authResponse.error,
    };
  }

  if (authResponse.data.user) {
    const meta = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .eq("email", email)
      .eq("password", password);
    

    if (meta.error) {
      return {
        success: false,
        error: meta.error,
      };
    }

    return {
      ...authResponse,
      meta,
      success: true,
    };
  }

  return {
    success: false,
    message: "An unknown error has occurred",
  };
};



export { registerUser, loginUser };

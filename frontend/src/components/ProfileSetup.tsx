import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

function ProfileSetup() {
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [goal, setGoal] = useState("");
  const [diet, setDiet] = useState("");
  const [allergies, setAllergies] = useState("");
  const [saved, setSaved] = useState(false);

  const calculateAge = (date: string) => {
    if (!date) return "";
    const birthDate = new Date(date);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  useEffect(() => {
    const loadProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "user_profiles", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data: any = snap.data();
        setDob(data.dob || "");
        setGender(data.gender || "");
        setGoal(data.goal || "");
        setDiet(data.diet || "");
        setAllergies((data.allergies || []).join(", "));
        setSaved(true);
      }
    };

    loadProfile();
  }, []);

  const saveProfile = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login to save profile");
      return;
    }

    await setDoc(
      doc(db, "user_profiles", user.uid),
      {
        uid: user.uid,
        name: user.displayName || "",
        email: user.email || "",
        dob,
        age: calculateAge(dob),
        gender,
        goal,
        diet,
        allergies: allergies
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    setSaved(true);
  };

  return (
    <section className="action-card">
      <h2>👤 Health Profile</h2>

      <label className="small-text">Date of Birth</label>
      <input
        type="date"
        value={dob}
        onChange={(e) => {
          setDob(e.target.value);
          setSaved(false);
        }}
      />

      {dob && <p className="small-text">Age: {calculateAge(dob)}</p>}

      <select value={gender} onChange={(e) => { setGender(e.target.value); setSaved(false); }}>
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
        <option value="Prefer not to say">Prefer not to say</option>
      </select>

      <select value={goal} onChange={(e) => { setGoal(e.target.value); setSaved(false); }}>
        <option value="">Select Goal</option>
        <option value="Weight Loss">Weight Loss</option>
        <option value="Weight Gain">Weight Gain</option>
        <option value="Muscle Gain">Muscle Gain</option>
        <option value="Diabetes Friendly">Diabetes Friendly</option>
        <option value="Heart Health">Heart Health</option>
        <option value="General Fitness">General Fitness</option>
      </select>

      <select value={diet} onChange={(e) => { setDiet(e.target.value); setSaved(false); }}>
        <option value="">Select Diet Type</option>
        <option value="Normal">Normal</option>
        <option value="Vegetarian">Vegetarian</option>
        <option value="Vegan">Vegan</option>
        <option value="Keto">Keto</option>
        <option value="High Protein">High Protein</option>
        <option value="Low Sugar">Low Sugar</option>
        <option value="Low Sodium">Low Sodium</option>
      </select>

      <input
        type="text"
        placeholder="Allergies e.g. peanuts, milk, soy"
        value={allergies}
        onChange={(e) => {
          setAllergies(e.target.value);
          setSaved(false);
        }}
      />

      <button onClick={saveProfile}>
        {saved ? "✅ Profile Saved" : "💾 Save Profile"}
      </button>
    </section>
  );
}

export default ProfileSetup;
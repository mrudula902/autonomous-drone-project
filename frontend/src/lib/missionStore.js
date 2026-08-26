import { supabase } from "./supabaseClient";


export async function saveMissionToCloud(mission) {

  if (!supabase) {
    localStorage.setItem(
      "autonomousMission",
      JSON.stringify(mission)
    );

    const missions =
      JSON.parse(
        localStorage.getItem("missions") || "[]"
      );

    localStorage.setItem(
      "missions",
      JSON.stringify([
        mission,
        ...missions.filter(
          (m) => m.name !== mission.name
        ),
      ])
    );

    return {
      local: true,
      mission,
    };
  }


  const { data, error } =
    await supabase
      .from("missions")
      .insert([
        {
          name: mission.name,
          mission_data: mission,
        },
      ])
      .select()
      .single();


  if (error) {
    throw new Error(error.message);
  }


  return data;
}


export async function getMissionsFromCloud() {

  if (!supabase) {

    return JSON.parse(
      localStorage.getItem("missions") || "[]"
    ).map((mission, index) => ({
      id: index,
      mission_data: mission,
    }));
  }


  const { data, error } =
    await supabase
      .from("missions")
      .select("*")
      .order("created_at", {
        ascending: false,
      });


  if (error) {
    throw new Error(error.message);
  }


  return data || [];
}


export async function getLatestMission() {

  if (!supabase) {
    return JSON.parse(
      localStorage.getItem(
        "autonomousMission"
      ) || "null"
    );
  }


  const { data, error } =
    await supabase
      .from("missions")
      .select("*")
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();


  if (error) {
    throw new Error(error.message);
  }


  return data
    ? data.mission_data
    : null;
}
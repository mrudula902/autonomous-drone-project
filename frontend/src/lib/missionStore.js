import { supabase } from "./supabaseClient";

export async function saveMissionToCloud(mission) {
  const { data, error } = await supabase
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
  const { data, error } = await supabase
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
  const { data, error } = await supabase
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

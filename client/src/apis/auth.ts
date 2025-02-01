import instance from "@/axios/axios.config";

export async function getUserData() {
  const { data } = await instance.get('/auth/me');
  console.log(data);
  return data;
}

export async function logoutUser() {
  const data = await instance.post('/auth/logout');
  return data;
}

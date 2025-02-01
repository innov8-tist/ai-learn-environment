import instance from "@/axios/axios.config";

export async function uploadFileToCloud(body: any) {
    const  data  = await instance.post('/cloud', body,{
        headers:{
            'Content-Type': 'multipart/form-data'
        }
    });
    return data;
}


export async function fetchFilesByAuthor(authorId: string) {
    const { data } = await instance.get(`/cloud/author/${authorId}`);
    return data;
}

import { createClient } from '@supabase/supabase-js'

// Create Supabase client
const supabase = createClient(process.env.projecturl as string, process.env.apikey as string)

// Upload file using standard upload
async function uploadFile(file:Buffer,filename:string) {
  console.log(process.env.projecturl as string, process.env.apikey as string)
  const { data, error } = await supabase.storage.from('profileimage').upload(filename, file,{
    contentType: "image/jpg",
  })
  if (error) {
    console.log(error)
    return false
  } else {
    return true
  }
}
export function getFileUrl(filename:string) {
  const { data:{publicUrl} } = supabase.storage.from('profileimage').getPublicUrl(filename)
    return publicUrl
}


export default uploadFile;
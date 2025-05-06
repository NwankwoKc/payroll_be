import { createClient } from '@supabase/supabase-js'

// Create Supabase client
const supabase = createClient(process.env.projecturl as string, process.env.apikey as string)

// Upload file using standard upload
async function uploadFile(file: Buffer,filename:string,filePath:string) {
  const { data, error } = await supabase.storage.from('profileimage').upload(filePath, file,{
    contentType: "image/jpeg",
  })
  if (error) {
    return false
  } else {
    return true
  }
}

export default uploadFile;
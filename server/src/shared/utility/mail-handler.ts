import FormData from 'form-data'

export const sendEmail = async (
  to: string,
  templateName: string,
  subject: string,
  data: Record<string, any> = {},
) => {
   const form = new FormData
   form.append('to', to)
   form.append('template', templateName)
   form.append('subject', subject)
   form.append()
};

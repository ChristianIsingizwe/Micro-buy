import FormData from 'form-data'
import config from 'config'

export const sendEmail = async (
  to: string,
  templateName: string,
  subject: string,
  templateVars: Record<string, any> = {},
) => {
   const form = new FormData
   form.append('to', to)
   form.append('template', templateName)
   form.append('subject', subject)
   form.append(
    'from',
    'sandbox271bf24d5254442aa644f51306b55851.mailgun.org'
   )
   Object.keys(templateVars).forEach((key)=>{
    form.append(`v:${key}`, templateVars[key])
   })

   const username = 'api'
   const password= config.get('emailService.privateKey')
};

'use server'

import { revalidatePath } from 'next/cache'
import {registerAttendee} from "../../lib/appwrite-server"
export async function registerStudent(prevState, formData) {
  // Simulate a delay to show loading state
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Process the form data
  const name = formData.get('name')
  const department = formData.get('department')
  const year = formData.get('year')
  const whatsappNumber = formData.get('whatsappNumber')
  const hasLaptop = formData.get('hasLaptop')
  const heardOfEngines = formData.get('heardOfEngines')
  const paymentScreenshot = formData.get('paymentScreenshot')
  const upiTransactionId = formData.get('upiTransactionId')

  // Here you would typically save this data to a database
  console.log('Form data:', { name, department, year, whatsappNumber, hasLaptop, heardOfEngines, upiTransactionId })

  // Check if all required fields are filled
  if (!name || !department || !year || !whatsappNumber || !hasLaptop || !heardOfEngines || !upiTransactionId) {
    return { success: false, message: 'Please fill all required fields.' }
  }

  // Check if WhatsApp number is valid
  if (!/^\d{10}$/.test(whatsappNumber)) {
    return { success: false, message: 'Please enter a valid 10-digit WhatsApp number.' }
  }

  // Check if payment screenshot is uploaded
  if (!paymentScreenshot) {
    return { success: false, message: 'Please upload the payment screenshot.' }
  }

  // If everything is valid, return success
  // revalidatePath('/')
  const result = await registerAttendee(Object.fromEntries(formData))
  const {id,success} = result
  return { success, message: success?'Registration successful!':"Please register again" }
}
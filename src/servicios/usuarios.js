import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function createUsuario({ name, email, password }) {
  const hashedPassword = await bcrypt.hash(password, 10)
  const usuario = new User({ name, email, password: hashedPassword })
  return await usuario.save()
}

export async function loginUsuario({ email, password }) {
  const usuario = await User.findOne({ email })
  if (!usuario) {
    throw new Error('Nombre de Usuario Incorrecto!')
  }
  const isPasswordCorrect = await bcrypt.compare(password, usuario.password)
  if (!isPasswordCorrect) {
    throw new Error('Contraseña invalida!')
  }
  const token = jwt.sign({ sub: usuario._id }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  })
  return token
}

export async function getUsuarioInfoById(userId) {
  try {
    const usuario = await User.findById(userId)
    if (!usuario) return { email: userId }
    return { email: usuario.email, name: usuario.name }
  } catch (err) {
    return { email: userId }
  }
}
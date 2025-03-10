import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Typography, Paper, Box, Button } from '@mui/material'

function ServiceDetails() {
  const { id } = useParams()
  const [service, setService] = useState(null)
  const navigate = useNavigate()

  const fetchServiceById = async () => {
    try {
      // Предполагается эндпоинт GET /service/:id на бэкенде
      const response = await fetch(`http://localhost:8080/service/${id}`)
      if (!response.ok) throw new Error('Ошибка загрузки сервиса')
      const data = await response.json()
      setService(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchServiceById()
  }, [id])

  if (!service) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h5" align="center" sx={{ mt: 5 }}>
          Загрузка...
        </Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h4" align="center">
          Детальная информация
        </Typography>
      </Box>

      <Paper sx={{ p: 2, backgroundColor: '#1e1e1e', color: '#fff' }}>
        <Typography variant="body1">
          <strong>ID:</strong> {service.id}
        </Typography>
        <Typography variant="body1">
          <strong>Name:</strong> {service.name}
        </Typography>
        <Typography variant="body1">
          <strong>Port:</strong> {service.port}
        </Typography>
        <Typography variant="body1">
          <strong>Address:</strong> {service.address}
        </Typography>
        {/* Если есть дополнительные поля, отобразите их здесь */}
      </Paper>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Button variant="contained" onClick={() => navigate(-1)}>
          Назад
        </Button>
      </Box>
    </Container>
  )
}

export default ServiceDetails

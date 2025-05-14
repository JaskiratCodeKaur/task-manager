import React from 'react'
import Header from '../main/Header'
import TaskListNumbers from '../main/TaskListNumbers'
import TaskList from '../TaskList/TaskList'

const EmployeeDashboard = () => {
  return (
    <div className='p-10 bg-[#1C1C1C] h-screen w-screen'>
        <Header />
        <TaskListNumbers />
        <TaskList />
    </div>
  )
}

export default EmployeeDashboard
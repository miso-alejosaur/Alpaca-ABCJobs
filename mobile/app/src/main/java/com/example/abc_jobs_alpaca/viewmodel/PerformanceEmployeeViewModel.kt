package com.example.abc_jobs_alpaca.viewmodel

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.example.abc_jobs_alpaca.model.models.EmployeePerformance
import com.example.abc_jobs_alpaca.model.models.EvaluationEmployeeRequest
import com.example.abc_jobs_alpaca.model.repository.ABCJobsRepository
import com.example.abc_jobs_alpaca.utils.MessageEvent
import com.example.abc_jobs_alpaca.utils.MessageType
import java.util.Date

class PerformanceEmployeeViewModel (
    private val abcJobsRepository: ABCJobsRepository,
    private val employeeId: Int,
    private val fullName: String,
    private val result: Int
): ViewModel() {
    var employeeItem: MutableLiveData<EmployeePerformance?> = MutableLiveData(null)
    private val messageLiveData = MutableLiveData<MessageEvent>()

    fun loadEmployeeData() {
        employeeItem.value = EmployeePerformance(
            employeeId, fullName, result
        )
    }

    suspend fun savePerformanceEmployee(token: String, employeeId:Int, result: Int) {
        var request = EvaluationEmployeeRequest(Date(), result)
        val response = abcJobsRepository.postEvaluateEmployee(token, employeeId, request)
        response.onSuccess {
            messageLiveData.postValue(MessageEvent(MessageType.SUCCESS, "Ok"))
        }
    }
}
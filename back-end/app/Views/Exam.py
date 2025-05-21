
# type: ignore
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..Models.exam import Domain , Test ,Question , Answer
from ..Serializers.Exam import DomainSerializer , TestSerializer ,QuestionSerializer ,AnswerSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.request import Request
from django.shortcuts import get_object_or_404
from django.db.models import Q

# Create your views here.

#############################################################################################
class DomainListCreate(APIView):
    serializer_class = DomainSerializer
    
    def get(self, request: Request, *args, **kwargs):
        # Extract search and filter criteria from query parameters
        search_query = request.query_params.get('search', '')
        status_filter = request.query_params.get('status', '')
        sort_by = request.query_params.get('sort_by', '-CreatedDate')

        # Start with all domains
        domains = Domain.objects.all()

        # Apply search filter if provided
        if search_query:
            domains = domains.filter(
                Q(DomainName__icontains=search_query) |  # Match domain name (case insensitive)
                Q(DomainDescription__icontains=search_query)  # Match domain description (case insensitive)
            )

        # Apply status filter if provided
        if status_filter and status_filter.lower() != 'all statuses':
            domains = domains.filter(Status=status_filter)

        # Apply sorting based on query parameter
        if sort_by == 'name_asc':
            domains = domains.order_by('DomainName')  
        elif sort_by == 'name_desc':
            domains = domains.order_by('-DomainName') 
        elif sort_by == 'date_asc':
            domains = domains.order_by('CreatedDate')  
        else:  # date_desc (default)
            domains = domains.order_by('-CreatedDate')  

        serializer = self.serializer_class(domains, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK) 
    
    def post(self, request: Request, *args, **kwargs):
        # Create a new domain entry
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            response = {
                "message": "Domain created",  
                "data": serializer.data  
            }
            return Response(data=response, status=status.HTTP_201_CREATED) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  


class DomainRetrieveUpdateDelete(APIView):
    serializer_class = DomainSerializer
    
    def get(self, request: Request, Domain_ID:int):
        # Retrieve a specific domain by ID
        domain = get_object_or_404(Domain, pk=Domain_ID)
        serializer = self.serializer_class(instance=domain)
        return Response(data=serializer.data, status=status.HTTP_200_OK) 
    
    def put(self, request: Request, Domain_ID:int):
        # Update an existing domain
        domain = get_object_or_404(Domain, pk=Domain_ID)
        data = request.data
        serializer = self.serializer_class(instance=domain, data=data)
        
        if serializer.is_valid():
            serializer.save()
            response = {
                "message": "Domain is updated successfully", 
                "data": serializer.data 
            }
            return Response(data=response, status=status.HTTP_200_OK)  
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  
    
    def delete(self, request: Request, Domain_ID:int):
        # Delete a specific domain
        domain = get_object_or_404(Domain, pk=Domain_ID)
        domain.delete()
        return Response(status=status.HTTP_204_NO_CONTENT) 


#############################


class TestListCreate(APIView):
    serializer_class = TestSerializer

    def get(self, request):
        tests = Test.objects.all()
        serializer = self.serializer_class(tests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            response = {
                "message": "Test created",
                "data": serializer.data
            }
            return Response(data=response, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class TestRetrieveUpdateDelete(APIView):
    serializer_class = TestSerializer

    def get(self, request, TestID):
        test = get_object_or_404(Test, pk=TestID)
        serializer = self.serializer_class(instance=test)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


    def put(self, request, TestID:int):
        test = get_object_or_404(Test, pk=TestID)
        serializer = self.serializer_class(test, data=request.data)
        if serializer.is_valid():
            serializer.save()
            response={
                "message":"Test is updated successfully",
                "data":serializer.data
            }
            return Response(data=response, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request, TestID):
        test = get_object_or_404(Test, pk=TestID)
        test.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



###########################################

class QuestionListCreate(APIView):
    serializer_class = QuestionSerializer

    def get(self, request: Request, TestID):
        questions = Question.objects.filter(Test__pk=TestID)
        serializer = self.serializer_class(questions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, TestID):
        test = get_object_or_404(Test, pk=TestID)
        data = request.data.copy()
        data['Test'] = TestID 
        serializer = self.serializer_class(data=data)
        if serializer.is_valid():
            serializer.save()
            response = {
                "message": "Question created",
                "data": serializer.data
            }
            return Response(data=response, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class QuestionRetrieveUpdateDelete(APIView):
    serializer_class = QuestionSerializer

    def get(self, request, QuestionID):
        question = get_object_or_404(Question, pk=QuestionID)
        serializer = self.serializer_class(question)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, QuestionID):
        question = get_object_or_404(Question, pk=QuestionID)
        data = request.data.copy()
        data['Test'] = question.Test.pk 
        serializer = self.serializer_class(question, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, QuestionID):
        question = get_object_or_404(Question, pk=QuestionID)
        question.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



###########################################################
class AnswerListCreate(APIView):
    serializer_class = AnswerSerializer

    def get(self, request, QuestionID):
        answers = Answer.objects.filter(Question__pk=QuestionID)
        serializer = self.serializer_class(answers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, QuestionID):
        question = get_object_or_404(Question, pk=QuestionID)
        data = request.data.copy()
        data['Question'] = QuestionID  
        serializer = self.serializer_class(data=data)
        if serializer.is_valid():
            serializer.save()
            response = {
                "message": "Answer created",
                "data": serializer.data
            }
            return Response(data=response, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AnswerRetrieveUpdateDelete(APIView):
    serializer_class = AnswerSerializer

    def get(self, request, AnswerID):
        answer = get_object_or_404(Answer, pk=AnswerID)
        serializer = self.serializer_class(answer)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, AnswerID):
        answer = get_object_or_404(Answer, pk=AnswerID)
        data = request.data.copy()
        data['Question'] = answer.Question.pk 
        serializer = self.serializer_class(answer, data=data)
        if serializer.is_valid():
            serializer.save()
            response={
                "message": "Answer updated successfully",
                "data": serializer.data
            }
            return Response(data=response, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, AnswerID):
        answer = get_object_or_404(Answer, pk=AnswerID)
        answer.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Create your views here.

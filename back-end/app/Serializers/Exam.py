# type: ignore

from rest_framework import serializers
from ..Models.exam import Domain, Test, Question ,Answer



class DomainSerializer(serializers.ModelSerializer):
    class Meta:
        model = Domain
        fields = ['DomainID', 'DomainName', 'DomainDescription', 'Status', 'CreatedDate']

# class DomainSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Domain
#         fields = '__all__' 



class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__'


class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = '__all__'


class TestSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Test
        fields = '__all__'

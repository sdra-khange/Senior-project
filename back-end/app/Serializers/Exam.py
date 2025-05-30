# type: ignore

from rest_framework import serializers
from ..Models.exam import Domain, Test, Question ,Answer,ContentType,Content



class DomainSerializer(serializers.ModelSerializer):
    class Meta:
        model = Domain
        fields = ['DomainID', 'DomainName', 'DomainDescription', 'Status', 'CreatedDate']





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



class ContentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentType
        fields = '__all__'

class ContentSerializer(serializers.ModelSerializer):
    ContentType = ContentTypeSerializer(read_only=True)
    Domain = DomainSerializer(read_only=True)
    CreatedBy = serializers.StringRelatedField()  # يعرض اسم المستخدم فقط
    
    class Meta:
        model = Content
        fields = '__all__'
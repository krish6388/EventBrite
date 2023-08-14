from django.shortcuts import render
from .serializers import EventSerializer, UserSerializer
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Event, User, Liking  

# ****************************************************View for event liking********************************************************************************

@api_view(['POST'])
def liked(request):
    if request.method == 'POST':
        if request.data['user_id'] == 0:
            return Response({'post_result': '0'}, status=200)
        else:
            like_event = Liking.objects.filter(user_id=request.data['user_id']).filter(event_id = request.data['event_id'])[0]
            print(like_event.event_id)
            print(like_event.is_liked)
            like_event.is_liked = not (like_event.is_liked)
            print(like_event.is_liked)
            like_event.save()
            return Response({'post_result': '1'}, status=201)

# ****************************************************View for all events********************************************************************************

@api_view(['POST'])
def yourevents(request):
    if request.method == 'POST':
        events = Event.objects.filter(user_id=request.data['user_id'])
        events = events[::-1]
        likings = Liking.objects.filter(user_id=request.data['user_id']).filter(is_liked = True)
        liked_events = []
        for like in likings:
            liked_events.append(like.event_id)
        for event in events:
            if event.event_id in liked_events:
                event.is_liked = True
        serializer = EventSerializer(events, context={'request': request}, many=True)
        
        return Response(serializer.data)
    
# ****************************************************View for login********************************************************************************

@api_view(['POST'])
def login(request):
    if request.method == 'POST':
        
        data = request.data
        print(data['email'])
        user = User.objects.filter(email=data['email'])[0]
        print(user.user_id)
        if user:
            print('User found')
            if user.password == data['password']:
                return Response({'post_result': '1', 'user_id': user.user_id, 'user_name': user.name}, status=201)
        return Response({'post_result': '0'}, status=200)

# ****************************************************View for users list********************************************************************************

@api_view(['GET', 'POST'])
def users_list(request):
    if request.method == 'GET':
        data = User.objects.all()
        
        serializer = UserSerializer(data, context={'request': request}, many=True)

        return Response(serializer.data)
    
    elif request.method == 'POST':        
        data = request.data
        print(data)
        obj = User.objects.filter(email=data['email'])
        if obj:
            print('User found')
            
            return Response({'post_result': '0', 'user_id': obj.user_id, 'user_name': obj.name}, status=200)
        else:
            print("Adding new user")
            user = User(**data)
            user.save()
            totalEvents = Event.objects.all()
            for e in totalEvents:
                likingData = {
                    "event_id": e.event_id, 
                    "user_id" : user.user_id, 
                    "is_liked" : False
                }
                like = Liking(**likingData)
                like.save()
            
                
        return Response({'post_result': '1', 'user_id': user.user_id, 'user_name': user.name}, status=201)

# ****************************************************View for event list********************************************************************************

@api_view(['GET', 'POST', 'PUT'])
def events_list(request):
    if request.method == 'PUT':
        data = Event.objects.all()
        data = data[::-1]
        if request.data['user_id'] != 0:
            likings = Liking.objects.filter(user_id=request.data['user_id']).filter(is_liked = True)
            liked_events = []
            for like in likings:
                liked_events.append(like.event_id)
            for event in data:
                if event.event_id in liked_events:
                    event.is_liked = True
        print(data)
        for event in data:
                print(event.is_liked)
        serializer = EventSerializer(data, context={'request': request}, many=True)
        print(serializer)

        return Response(serializer.data)
    elif request.method == 'POST':
        try:
            event = Event(event_name = request.data.get('event_name'),
            event_time = request.data.get('event_time'),
            event_data = request.data.get('event_data'),
            event_loc = request.data.get('event_loc'),
            user_id = request.data.get('user_id'),
            is_liked = False,
            event_img = request.FILES.get('event_img'))


            
            event.save()
            totalUsers = User.objects.all()
            for u in totalUsers:
                    likingData = {
                        "event_id": event.event_id, 
                        "user_id" : u.user_id, 
                        "is_liked" : False
                    }
                    like = Liking(**likingData)
                    like.save()
                
                    
            return Response({'post_result': '1'}, status=201)
        except Exception as e:
            return Response({'post_result': '1'}, status=201)


from django.shortcuts import render

def race(request):
    challenge_text = 'Sample challenge text'  # Replace with your actual challenge text
    return render(request, 'race.html', {'challenge_text': challenge_text})

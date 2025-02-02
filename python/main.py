from fastapi import FastAPI, Depends
from pydantic import BaseModel
from langchain.agents import AgentType
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_experimental.agents.agent_toolkits import create_csv_agent
from langchain_experimental.tools.python.tool import PythonREPLTool
from langchain.agents import initialize_agent, Tool,AgentType
from llama_index.llms.openrouter import OpenRouter
from llama_index.agent.openai import OpenAIAgent
from llama_index.core.llms import ChatMessage
from llama_index.experimental.query_engine import PandasQueryEngine
from langchain_groq import ChatGroq
import json
import requests
from bs4 import BeautifulSoup
import ast
import pandas as pd
from yt_dlp import YoutubeDL
from langchain_community.document_loaders import YoutubeLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.retrievers import EnsembleRetriever, BM25Retriever
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import DocumentCompressorPipeline, LLMChainFilter
from langchain_community.document_transformers import EmbeddingsRedundantFilter
from langchain.retrievers.document_compressors import FlashrankRerank
from langchain.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
import re
from pydantic import BaseModel, Field
from typing import Optional
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from datetime import datetime
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can specify specific origins like ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods like POST, GET, etc.
    allow_headers=["*"],  # Allows all headers
)
class UserCreate(BaseModel):
    data: str

class YoutubeLink(BaseModel):
    link:str

class YoutubeQuestionAnswer(BaseModel):
    link: Optional[str] = Field(default=None, description="Extract the youtube link only from the query")
    query: str = Field(default="Now I Studied", description="Paste the user question here")
    
class YoutubeVideoExtraction(BaseModel):
    link: Optional[str] = Field(default=None, description="Extract the youtube link only from the query")
    query: str = Field(default="Now I Studied", description="Paste the user question here")
    start_time: Optional[int] = Field(default=None, description="Start time of the video in seconds")
    end_time: Optional[int] = Field(default=None, description="End time of the video in seconds")

llm3 = None
agent = None
llm=None
mainllm=None
rag_youtube=None
groq=None
@app.on_event("startup")
async def startup_event():
    global llm3, agent,llm,mainllm,groq
    llm3 = ChatGoogleGenerativeAI(
        api_key="AIzaSyBNAqwF1Uyse800GQ0ML3dKP5CNoBRceRg",
        model="gemini-1.5-pro",
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=2,
    )
    from langchain_groq import ChatGroq
    
    api_key="9ff4442add386aaadcc7bf2df155391a268d690b1c0cf4b28992a86483bfa396"
    from langchain_together import ChatTogether
    together = ChatTogether(
        api_key=api_key,
        model="deepseek-ai/deepseek-llm-67b-chat",
    )
    groq=ChatGroq(
    api_key="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",
    model_name="gemma2-9b-it",
    temperature=0,
)
    llm = OpenRouter(
        api_key="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",
        model="openai/gpt-4o-2024-11-20",
    )
    agent = initialize_agent(
    llm=together,
    tools=[tool1,tool2,tool3,tool4],
    verbose=True,
    agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    max_iterations=3,
    handle_parsing_errors=True
    )
    print("LLM are initialized successfully.")


@app.post("/questionpaper/")
async def create_user(inputs: UserCreate):
    global agent
    text = inputs.data
    print(text)
    res = agent.invoke(text)
    out = res['output']
    return {
        'msg': 'We got data successfully',
        'msg1': out,
    }
    
    
def getFun(data):
    agent = create_csv_agent(
        llm3,
        "ktu_question.csv",
        verbose=True,
        agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
        allow_dangerous_code=True,
        handle_parsing_errors=True
    )
    
    res=agent.invoke(data)
    return res

def getAdd(user_input):
   
    input=f"add a new row into the dataframe with {user_input}"
    new_data = {'Subject': 'datastructure Question Paper',
                'Semester(S)': 's5',
                'Year': '2023',
                'Link': 'https://manu.com'}
    prompt=f"You are a csv expert your task is to based on the user prompt format like this example:{new_data}  and the USERINPUT:{input} You only give the formated output no need of explation and capitalize the user input"
    data=llm.complete(prompt)
    res = ast.literal_eval(data.text)
    
    csv_file = 'ktu_question.csv'
    try:
        df = pd.read_csv(csv_file)
    except FileNotFoundError:

        df = pd.DataFrame(columns=['ID', 'Subject', 'Semester(S)', 'Year', 'Link'])
    if 'ID' in df.columns and not df.empty:
        new_id = df['ID'].max() + 1
    else:
        new_id = 1

    res['ID'] = new_id

    df.loc[len(df)] = res

    df.to_csv(csv_file, index=False)

    return"Data added successfully. Updated file saved as {csv_file}."   


def getSingleUpdate(input):
    df=pd.read_csv("ktu_question.csv")
    query_engine = PandasQueryEngine(df=df,llm=llm, verbose=True)
    links = llm.complete(
        f"""
        Analyze the provided input and identify:
        - The link that should be located in the CSV file.
        - The link that should replace it.

        Input: <input>{input}</input>

        Return the output in the exact JSON-like structure below:
        {{
            "findlink": "[link to locate in the CSV]",
            "replacelink": "[link to replace it with]"
        }}
        """
    )
    data=links
    cleaned_output = data.text.strip() 
    if cleaned_output.startswith("```json"):
        cleaned_output = cleaned_output[7:] 
    if cleaned_output.endswith("```"):
        cleaned_output = cleaned_output[:-3]  
    import json

    try:
        result = json.loads(cleaned_output)
        findlink = result.get("findlink")
        replacelink=result.get("replacelink")
        print("\nFind Link:", findlink)
        print("\nReplace Link:", replacelink)
    except json.JSONDecodeError as e:
        print("Failed to parse JSON:", e)
    csv_file = 'ktu_question.csv'
    df=pd.read_csv(csv_file)
    response = query_engine.query(
    f"give the id of this link :{findlink}"
    )
    import re
    string=response.response
    match = re.search(r'(\d+)\s+(\d+)', string)

    if match:
        original_id = match.group(2)
        print("Original ID:", original_id)
    else:
        return "fail data is not updated"
    print(original_id)
    df.loc[df['ID'] == int(original_id), 'Link'] = replacelink
    csv_file1 = 'ktu_question.csv'
    df.to_csv(csv_file1, index=False)
    return "data replaced sucessfully" 
def deleteSomething(input):
    return "Tell the user you dont have any permision to delete datas"
tool1=Tool(
    name="getinformation",
    func=getFun,
    description="Useful when the user need to fetch data from the csv"
)
tool2=Tool(
    name="updatenewinformation",
    func=getAdd,
    description="Useful when the user need to update new data into the csv"
)
tool3=Tool(
    name="updatespecificlink",
    func=getSingleUpdate,
    description="Useful when the user want to update single link in the csvfile with new link"
)
tool4=Tool(
    name="delete",
    func=deleteSomething,
    description="user want to delete somthing from the csv"
)


def load_and_process_data(link):
    try:
        loader = YoutubeLoader.from_youtube_url(
    link, add_video_info=False
        )
        texts=loader.load()
        chunking = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=30)
        chunks = chunking.split_documents(texts)
        db = FAISS.from_documents(chunks, GoogleGenerativeAIEmbeddings(google_api_key="AIzaSyBNAqwF1Uyse800GQ0ML3dKP5CNoBRceRg", model="models/embedding-001"))
        return db, chunks
    except UnicodeDecodeError as e:
        print(f"Error decoding file {link}: {e}")
        raise
    except Exception as e:
        print(f"Error loading data: {e}")
        raise
def Rag_Calling(final_retriver):
    _filter = LLMChainFilter.from_llm(llm3)
    _redudentfilter = EmbeddingsRedundantFilter(embeddings=GoogleGenerativeAIEmbeddings(google_api_key="AIzaSyBNAqwF1Uyse800GQ0ML3dKP5CNoBRceRg", model="models/embedding-001"))
    rerank = FlashrankRerank()
    pipeline = DocumentCompressorPipeline(transformers=[_redudentfilter, rerank])
    final_chain = ContextualCompressionRetriever(base_compressor=pipeline, base_retriever=final_retriver)
    return final_chain

@app.post("/youtubesummerization/")
def Youtube(link:YoutubeLink):
    global rag_youtube
    structured_llm=groq.with_structured_output(YoutubeQuestionAnswer)
    answer=structured_llm.invoke(link.link)
    print(answer)
    if answer.link !="None" and rag_youtube is None: 
        db,chunks=load_and_process_data(answer.link)
        retriver1 = db.as_retriever(search_kwargs={"k": 4})
        retriver2 = BM25Retriever.from_documents(chunks, k=4)
        final_retriver = EnsembleRetriever(retrievers=[retriver1, retriver2], weights=[0.5, 0.5])
        template = "You should answer the question based on the context. Context: {context} and Question: {question}"
        prompt = PromptTemplate.from_template(template)
        retriver = Rag_Calling(final_retriver)
        chain = (
            {
                "context": retriver,
                "question": RunnablePassthrough()
            }
            | prompt
            | groq
            | StrOutputParser()
        )
        
        rag_youtube=chain
    else:
        if rag_youtube is None:
            return {"message": "You have not uploaded any video link"}
    try:
        print(answer.query)
        result = rag_youtube.invoke(answer.query)
        return {"result": result}
    except Exception as e:
        return {"message": f"An error occurred during inference: {str(e)}"}


class Infrerence(BaseModel):
    question:str
    
@app.post("/chatllm/")
def llmInfer(query:Infrerence):
    if llm is None:
        return {"message": "LLM Not init"}
    try:
         result=llm.complete(query.question)
         return {"result":result.text}
    except Exception as e:
        return {"messages": f"An error occurred during inference: {str(e)}"}

import os
import time
import requests
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pytube import YouTube
from youtube_dl import YoutubeDL


progress_data = {} 

class Inference(BaseModel):
    question: str

import os
import time
import yt_dlp

def progress_hook(d):
    """
    Hook function to send download progress updates.
    """
    global progress_data
    if d['status'] == 'downloading':
        progress_data["progress"] = d['_percent_str'].strip()  # Store progress
from yt_dlp import YoutubeDL
def download_video_segment(video_url, start_time, end_time, output_file_name):
    start_time_hms = str(int(start_time) // 3600).zfill(2) + ':' + str((int(start_time) % 3600) // 60).zfill(2) + ':' + str(int(start_time) % 60).zfill(2)
    end_time_hms = str(int(end_time) // 3600).zfill(2) + ':' + str((int(end_time) % 3600) // 60).zfill(2) + ':' + str(int(end_time) % 60).zfill(2)
    output_folder="../cloud"
    ydl_opts = {
        'format': 'bestvideo+bestaudio',
        'external_downloader': 'ffmpeg',
        'external_downloader_args': ['-ss', start_time_hms, '-to', end_time_hms],
        'outtmpl': os.path.join(output_folder, output_file_name + '.mp4'),  # Save as MP4
    }
    with YoutubeDL(ydl_opts) as ydl:
        ydl.download([video_url])


@app.get("/progress")
def stream_progress():
    """
    SSE endpoint to stream download progress.
    """
    def event_stream():
        while True:
            time.sleep(1)  # Stream updates every second
            yield f"data: {progress_data.get('progress', '0%')}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")

@app.post("/extractionyoutube/")
def youtubeExtraction(query: Inference):
    """
    Extracts a YouTube video and streams progress.
    """
    structured = groq.with_structured_output(YoutubeVideoExtraction)
    result = structured.invoke(query.question)
    print(result)
    # Extract video title
    r = requests.get(result.link)
    soup = BeautifulSoup(r.text, "html.parser")
    title = soup.find_all(name="title")[0].text
    print(title)
    # Start download with progress tracking
    download_video_segment(result.link, result.start_time, result.end_time, title.replace(" ",""))

    return {"message": "Video downloaded and stored in cloud","title":title}




#Email Automation endpoints
from langchain_community.utilities import SQLDatabase
from pydantic import Field,BaseModel
class EmailSender(BaseModel):
    sender:str
    reciver:str
    files:list
class FMstate(BaseModel):
    from_date: str | None = Field(default=None, description="The from date user mentioned")
    to_date: str | None = Field(default=None, description="The To date user mentioned")
    section: str | None = Field(default=None, description="The section user mentioned") 
    sender:str|None =Field(default=None,description="The Sender email address")

def FormatCall(state):
    final_llm=groq.with_structured_output(FMstate)
    res=final_llm.invoke(state['messages'][-1].content)
    return {"date_start":res.from_date,"date_end":res.to_date,"section":res.section,"sender":res.sender}

import psycopg2

def tool_calling_fun1(section):
    connection = psycopg2.connect(
        dbname="genedu",
        user="postgres",
        password="manu",
        host="localhost",
        port=5432
    )

    try:
        cursor = connection.cursor()

        fetch_query = """
        SELECT * FROM cloud 
        WHERE section = %s 
        """

        cursor.execute(fetch_query, (section,))
        datas = cursor.fetchall()  


        return datas
    except Exception as e:
        return {'messages': f"An error occurred while fetching: {e}"}
    finally:
        cursor.close()
        connection.close()
my_dict={}
def sorting(res):
    for data in res:
        dt = data[2]  
        year = dt.year
        month = dt.month
        day = dt.day

        my_dict[data[0]] = [year,month, day]
    return my_dict
    
def filter_by_date(start_date, end_date, my_dict):
    try:    
        date_start = datetime.strptime(start_date, "%Y-%m-%d")
        date_end = datetime.strptime(end_date, "%Y-%m-%d")
        print(date_start)
        print(date_end)
    except ValueError as e:
        print(f"Invalid date format: {e}")
        return {}

    filtered_dict = {}

    for key, value in my_dict.items():
        # Ensure the value has a valid date format (year, month, day)
        if len(value) < 3 or not all(isinstance(val, int) for val in value[:3]):
            continue  # Skip if data doesn't have valid date components
        
        # Convert the (year, month, day) to a datetime object
        try:
            record_date = datetime(value[0], value[1], value[2])
            if date_start <= record_date <= date_end:
                filtered_dict[key] = value
        except ValueError as e:
            print(f"Skipping invalid date entry {value}: {e}")  # Handle invalid date values if necessary

    return filtered_dict

import psycopg2

def PathFinding(filtered_data):
    paths = []  # Use a local list instead of a global one

    try:
        connection = psycopg2.connect(
            dbname="genedu",
            user="postgres",
            password="manu",
            host="localhost",
            port=5432
        )
        cursor = connection.cursor()

        fetch_query = "SELECT path FROM cloud WHERE id = %s"

        for key, val in filtered_data.items():
            print(f"Fetching for key: {key}")
            cursor.execute(fetch_query, (key,))
            datas = cursor.fetchall()  

            if datas:  # Ensure data exists before accessing
                paths.append(datas[0][0])  # Fetch first row's path column
            else:
                print(f"No path found for ID: {key}")

        return paths

    except Exception as e:
        return {'message': f"An error occurred while fetching: {e}"}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

def DataBaseFetchin(state):
    date_start=state['date_start']
    date_end=state['date_end']
    section=state['section']
    print(date_start,date_end,section)
    if date_start!="None" and date_end!="None" and section!="None":
        res=tool_calling_fun1(section)
        print(res)
        sorted=sorting(res)
        print(sorted)
        print("---------------------------------------------")
        print(date_start,date_end,sorted)
        print("-------------------------------------------")
        filtered_data = filter_by_date(date_start,date_end,sorted)
        final_paths=PathFinding(filtered_data)
        print(final_paths)
        return {"final_res":final_paths}
    else:
        return {"Please Metion the dates from and to and also the section you want"}

def dataBaseFilesFetching(theme:str):
    db = SQLDatabase.from_uri("postgresql+psycopg2://postgres:manu@localhost:5432/genedu")
    print(db.dialect)
    print(db.get_usable_table_names())

##GRaph Details 

from pydantic import BaseModel
from langgraph.graph import MessagesState
class MyState(MessagesState):
    date_start:str
    date_end:str
    section:str
    sender:str
    final_res:list
from langgraph.graph import StateGraph,MessagesState,START,END
@app.post("/emailautomation/")
def Graph(query:Inference):
    question=query.question
    workflow=StateGraph(MyState)
    workflow.add_node("format",FormatCall)
    workflow.add_node("database",DataBaseFetchin)
    workflow.add_edge(START,"format")
    workflow.add_edge("format","database")
    workflow.add_edge("database",END)
    app1=workflow.compile()
    res=app1.invoke({"messages":[question]})
    print(res['final_res'])
    res2=send_emails(res['sender'],res['final_res'])
    return res2


def send_emails(reciver,files):
    smtp_port,smtp_server,email_from, password=587,"smtp.gmail.com","manumanuvkm123@gmail.com","ouupizkcuioxqddf"
    simple_email_context = ssl.create_default_context()
    body = f"The Files are sended from {email_from} Through GenEdu"
    msg = MIMEMultipart()
    msg['From'] = email_from
    msg['To'] = reciver
    msg['Subject'] = "File Transfer Through GenEdu"

    msg.attach(MIMEText(body, 'plain'))

    # Attach multiple files
    for file in files:
        try:
            with open(file, "rb") as attachment:
                attachment_package = MIMEBase("application", "octet-stream")
                attachment_package.set_payload(attachment.read())
                encoders.encode_base64(attachment_package)
                attachment_package.add_header("Content-Disposition", f"attachment; filename={file}")
                msg.attach(attachment_package)
        except Exception as e:
            print(f"Error attaching file {file}: {e}")
    text = msg.as_string()
    try:
        print("Connecting to server...")
        tie_server = smtplib.SMTP(smtp_server, smtp_port)
        tie_server.starttls(context=simple_email_context)
        tie_server.login(email_from, password)
        print("Sending email...")
        tie_server.sendmail(email_from,reciver, text)
        print("Email sent successfully!")
    except Exception as e:
        print(f"Error: {e}")
        return {"messages":e}
    finally:
        tie_server.quit()
    return {"messages":"Email sent successfully!"}

from fastapi import FastAPI
from pydantic import BaseModel
import json

import os
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from llama_index.llms.openrouter import OpenRouter

SCOPES = ["https://www.googleapis.com/auth/calendar"]

class Todo(BaseModel):
    id: str
    title: str
    decs: str
    completed: bool
    createdAt: str
    autherId: str
def Format(input):
    llm = OpenRouter(
            api_key="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",
            model="openai/gpt-4o-2024-11-20",
            )
    
    prompt = f"""
    You are a JSON formatting expert. Your task is to fill the following JSON structure based on the user input.

    Example JSON structure:
    {{
        "summary": "Sample Event",
        "location": "Virtual",
        "description": "This is a test event.",
        "start": {{
            "dateTime": "2024-12-20T10:00:00",
            "timeZone": "America/Los_Angeles"
        }},
        "end": {{
            "dateTime": "2024-12-20T11:00:00",
            "timeZone": "America/Los_Angeles"
        }},
        "attendees": [
            {{"email": "example@example.com"}}
        ],
        "reminders": {{
            "useDefault": true
        }}
    }}

    USERINPUT: {input}

    Fill in the JSON structure with the information provided in the USERINPUT. Only provide the filled JSON without any explanation or additional text.
    """
    data=llm.complete(prompt)
       
    cleaned_output = data.text.strip() 
    if cleaned_output.startswith("```json"):
            cleaned_output = cleaned_output[7:] 
    if cleaned_output.endswith("```"):
            cleaned_output = cleaned_output[:-3]
    return cleaned_output
def main(input_text):
    creds = None
    token_path = "token.json"
    credentials_path = "C:\\Users\\SIRIN\\OneDrive\\Desktop\\GenEdu\\gen-edu\\python\\client_secret.json"

    if os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path, SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(credentials_path, SCOPES)
            creds = flow.run_local_server(port=0)

        with open(token_path, "w") as token:
            token.write(creds.to_json())

    try:
        service = build('calendar', 'v3', credentials=creds)
        event_data = Format(input_text)

        if event_data:
            event = service.events().insert(calendarId='primary', body=event_data).execute()
            print(f'Event created: {event.get("htmlLink")}')
            return {"message": "Success", "eventLink": event.get("htmlLink")}
        else:
            return {"message": "Failed to create event due to JSON error"}
    
    except HttpError as error:
        print(f"An error occurred: {error}")
        return {"message": "Error creating event"}

@app.post("/calender/")
def TodoDetails(details: Todo):
    endtime="1hr"
    input_text = f"""
    Event Details:
    ID: {details.id}
    Title: {details.title}
    Description: {details.decs}
    Completed: {details.completed}
    Created At: {details.createdAt}
    EndTime:{endtime}
    Author ID: {details.autherId}
    """

    formatted_event = Format(input_text) 
    print(formatted_event)
    res=main(formatted_event)
    return res


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='127.0.0.1', port=8001)

## Подготовка:

Задание выполнялось с помощью подсистемы Windows для Linux (WSL) в Windows 10. В WSL установлен Debian 10. Также для работы используется Windows Terminal. Установлен Python версии 3.9.5. В качестве базы данных используется PostgreSQL 13.

Создаем рабочую директорию с именем test. В директории test создаем виртуальное окружение при помощи команды python -m venv env

Активируем виртуальное окружение: . env/bin/activate или source env/bin/activate

Клонируем репозиторий командой 
git clone https://github.com/MarkTolubaev/training-test

Устанавливаем зависимости из файла pipList.txt:
pip install -r pipList.txt

Устанавливаем sqlalchemy, dotenv для использования переменных окружения и драйвер для взаимодействия python с PostgreSQL – psycopg2:
pip install sqlalchemy psycopg2 python-dotenv

Сохраняем список зависимостей в файл pipList.txt:
pip freeze > pipList.txt

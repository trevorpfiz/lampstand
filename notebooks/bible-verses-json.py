import json
import os


def load_detailed_bible(file_path):
    """Load the detailed Bible JSON data."""
    with open(file_path, "r", encoding="utf-8") as file:
        data = json.load(file)
    return data


def generate_summary(detailed_data):
    """Generate the summary structure with books, chapters, and verse counts."""
    summary = []

    for book in detailed_data.get("books", []):
        book_name = book.get("name")
        chapters = book.get("chapters", [])
        chapter_summaries = []

        for chapter in chapters:
            chapter_number = chapter.get("number")
            verses = chapter.get("verses", [])
            verse_count = len(verses)
            chapter_summaries.append({"chapter": chapter_number, "verses": verse_count})

        summary.append({"book": book_name, "chapters": chapter_summaries})

    return summary


def save_summary(summary_data, output_path):
    """Save the summary JSON data to a file."""
    with open(output_path, "w", encoding="utf-8") as file:
        json.dump(summary_data, file, indent=2, ensure_ascii=False)
    print(f"Summary JSON saved to {output_path}")


def main():
    input_file = "data/web.json"  # Replace with your input file name
    output_file = "bible_summary.json"  # Desired output file name

    if not os.path.exists(input_file):
        print(f"Input file '{input_file}' does not exist. Please check the file path.")
        return

    print("Loading detailed Bible data...")
    detailed_data = load_detailed_bible(input_file)

    print("Generating summary...")
    summary = generate_summary(detailed_data)

    print("Saving summary JSON...")
    save_summary(summary, output_file)


if __name__ == "__main__":
    main()

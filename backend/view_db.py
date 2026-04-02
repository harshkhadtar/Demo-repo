import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), '../database/app.db')

def print_table(cursor, table_name):
    print("\n" + "="*80)
    print(f" 📋 {table_name.upper()} TABLE")
    print("="*80)
    
    try:
        cursor.execute(f"SELECT * FROM {table_name}")
        rows = cursor.fetchall()
        
        if not rows:
            print(f"No {table_name} found.")
            return
            
        # Get column names
        column_names = [description[0] for description in cursor.description]
        
        # Calculate column widths
        col_widths = [len(name) for name in column_names]
        for row in rows:
            for i, val in enumerate(row):
                col_widths[i] = max(col_widths[i], len(str(val)))
                
        # Create formatter string
        format_str = " | ".join([f"{{:<{w}}}" for w in col_widths])
        
        # Print header
        print(format_str.format(*column_names))
        print("-" * (sum(col_widths) + len(col_widths)*3))
        
        # Print rows
        for row in rows:
            # Handle None values nicely
            formatted_row = ["" if val is None else str(val) for val in row]
            print(format_str.format(*formatted_row))
            
    except Exception as e:
        print(f"Error reading {table_name} table: {e}")

def view_database():
    if not os.path.exists(DB_PATH):
        print(f"Error: Database file not found at {DB_PATH}")
        return

    # Connect to the database
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    print_table(cursor, "users")
    print_table(cursor, "complaints")
    print_table(cursor, "announcements")

    conn.close()
    print("\nDone.")

if __name__ == "__main__":
    view_database()

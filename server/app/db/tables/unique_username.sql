-- prevent users have same username between tables

CREATE OR REPLACE FUNCTION check_username_exists()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admins WHERE username = NEW.username) THEN
    RAISE EXCEPTION 'username % already exists in admins', NEW.username;
  END IF;

  IF EXISTS (SELECT 1 FROM teachers WHERE username = NEW.username) THEN
    RAISE EXCEPTION 'username % already exists in teachers', NEW.username;
  END IF;

  IF EXISTS (SELECT 1 FROM parents WHERE username = NEW.username) THEN
    RAISE EXCEPTION 'username % already exists in parents', NEW.username;
  END IF;

  IF EXISTS (SELECT 1 FROM students WHERE username = NEW.username) THEN
    RAISE EXCEPTION 'username % already exists in students', NEW.username;
  END IF;

  -- If no conflict, continue with the operation
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER admins_before_insert_or_update
BEFORE INSERT OR UPDATE ON admins
FOR EACH ROW EXECUTE FUNCTION check_username_exists();

CREATE TRIGGER teachers_before_insert_or_update
BEFORE INSERT OR UPDATE ON teachers
FOR EACH ROW EXECUTE FUNCTION check_username_exists();

CREATE TRIGGER parents_before_insert_or_update
BEFORE INSERT OR UPDATE ON parents
FOR EACH ROW EXECUTE FUNCTION check_username_exists();

CREATE TRIGGER students_before_insert_or_update
BEFORE INSERT OR UPDATE ON students
FOR EACH ROW EXECUTE FUNCTION check_username_exists();
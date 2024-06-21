-- prevent users have same username between tables
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION check_username_exists()
RETURNS TRIGGER AS $$
BEGIN
  -- Skip email check if the email is not being updated
  IF TG_OP = 'UPDATE' AND NEW.email = OLD.email THEN
    RETURN NEW;
  END IF;
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

insert into center (subneighborhood_id ,neighborhood_id, municipal_district_id, municipality_id, province_id, region_id, regional_id, educational_district_id, center_code, school_code, phone, email, address, name, educative_sector, batch, type, zone, working_day) values ('f766c10f-8bbf-424e-8cba-c3f119e90754', 'e62ded7b-c044-48d4-9d5f-0b43a48761ef', 'e489b568-f2e9-4fba-9496-8d7076734d8c', '89a40b2b-235e-45e6-85f3-eef952807e48','ee25f757-1b44-49fc-b0c9-15abf2b58d4d', '89198347-9d82-4e30-800e-98ea940e905a', '64337f0d-e08d-4259-9fe3-cd9bb6487559', '05656965-8a43-48b4-90e6-7464eefb9d89', '842423', '6463456', '4120713671', 'centro@gmail.com', 'calle los tinajeros', 'el hipolito', 'test', 'test', 'test', 'rural', 'every');
insert into municipality (province_id, region_id, municipality_name) values ('ee25f757-1b44-49fc-b0c9-15abf2b58d4d', '89198347-9d82-4e30-800e-98ea940e905a', 'nombre');

CREATE OR REPLACE FUNCTION check_period_id()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM period WHERE id = NEW.id) THEN
    RAISE EXCEPTION 'id % already exists in period', NEW.id;
  END IF;

  IF EXISTS (SELECT 1 FROM kinder_period WHERE id = NEW.id) THEN
    RAISE EXCEPTION 'id % already exists in kinder_period', NEW.id;
  END IF;

  -- If no conflict, continue with the operation
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
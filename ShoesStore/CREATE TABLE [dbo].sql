

DBCC CHECKIDENT ('Shoes', RESEED, 8);

-- Delete the two out-of-sequence records
DELETE FROM Shoes WHERE Id IN (1001, 1002);

-- Reset the identity counter to continue from 9
DBCC CHECKIDENT ('Shoes', RESEED, 9);

-- Re-insert them with correct auto-generated IDs
INSERT INTO Shoes (Name, Price, Brand) VALUES ('Arnold', 1234, 'Marowa');
INSERT INTO Shoes (Name, Price, Brand) VALUES ('kwame', 99.99, 'oduro');
export const DUMMY_EMPLOYEE_LIST = Array.from({ length: 100 }).map((_, i) => ({
    id: `${(i + 11).toString().padStart(3, "0")}e${i}${i}-aa${i}-4f${i}-bb${i}-cc${i}dd${i}${i}`,
    firstName: [
        "Liam", "Olivia", "Noah", "Emma", "Ethan", "Ava", "Mason", "Sophia", "Logan", "Isabella",
        "Lucas", "Mia", "Oliver", "Amelia", "Jackson", "Harper", "Aiden", "Evelyn", "James", "Abigail",
        "Elijah", "Emily", "Benjamin", "Ella", "Henry", "Elizabeth", "Sebastian", "Avery", "Jack", "Sofia", "Adam", "Joseph"
    ][i % 30],
    lastName: [
        "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez",
        "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Davis", "Wilson"
    ][i % 20],
    title: [
        "Software Engineer",
        "QA Tester",
        "Business Analyst",
        "Sales Executive",
        "Technical Writer",
        "Operations Coordinator",
        "IT Support Specialist",
        "Cybersecurity Analyst",
        "Recruiter",
        "Data Engineer"
    ][i % 10],
    dateOfBirth: `1980-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
    employmentStatus: [
        "Full-Time Permanent",
        "Part-Time",
        "Contract",
        "Temporary",
        "Internship"
    ][i % 5],
    workLocation: ["Office", "Remote", "Hybrid"][i % 3],
    workEmail: `${[
        "liam", "olivia", "noah", "emma", "ethan", "ava", "mason", "sophia", "logan", "isabella",
        "lucas", "mia", "oliver", "amelia", "jackson", "harper", "aiden", "evelyn", "james", "abigail",
        "elijah", "emily", "benjamin", "ella", "henry", "elizabeth", "sebastian", "avery", "jack", "sofia", "adam", "joseph"
    ][i % 30]}.${[
        "johnson", "williams", "brown", "jones", "garcia", "miller", "davis", "rodriguez", "martinez", "hernandez",
        "lopez", "gonzalez", "wilson", "anderson", "thomas", "taylor", "moore", "jackson", "martin", "lee", "davis", "wilson"
    ][i % 20]}@company.com`,
    workPhone: `+1${String(3000000000 + i * 12345)}`,
}));
## CMS Task Assignment

This application is a content management system (CMS) that follows a **unidirectional data flow pattern** using Redux Toolkit and RTK Query.

#### Project Setup

```

git clone https://github.com/Patel-Muhammad/cms.git
cd cms
npm install
npm run dev

```

#### Data Flow

1. **User interacts** with UI components  
2. **Components dispatch actions** via Redux Toolkit's RTK Query  
3. **Data is persisted in localStorage** (simulating a backend)  
4. **Components subscribe** to and render data from the Redux store  

---

#### Project Structure


```
cms/
├── src/
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── ContentCard.tsx
│   │   ├── Header.tsx
│   │   ├── Modal.tsx
│   │   ├── Select.tsx
│   │   ├── TextArea.tsx
│   │   └── TextInput.tsx
│   ├── data/
│   │   └── mockData.json
│   ├── hooks/
│   │   └── use-mobile.tsx
│   ├── pages/
│   │   ├── CreateContent.tsx
│   │   ├── Dashboard.tsx
│   │   ├── EditContent.tsx
│   │   └── ViewContent.tsx
│   ├── store/
│   │   ├── api.ts
│   │   └── store.ts
│   ├── types/
│   │   └── content.ts
|   |
│   └── App.tsx

```


---

#### Content Types

- **Text Content**: Articles with formatted text
- **Quiz Content**: Multiple-choice questions with correct answers
- **Media Content**: Audio or video files with URLs

Each type is defined in `content.ts` using appropriate TypeScript interfaces.

---

#### State Management

Using **Redux Toolkit** and **RTK Query**:

- `store.ts`: Configures the Redux store
- `api.ts`: Defines API endpoints (using localStorage as a backend)

---

#### UI Components

- `Button.tsx`: Reusable button with different variants
- `TextInput.tsx`, `TextArea.tsx`, `Select.tsx`: Form input components
- `Modal.tsx`: Reusable modal component
- `ContentCard.tsx`: Displays content items in a card format

---

#### Pages

- `Dashboard.tsx`: Home page showing all content items
- `CreateContent.tsx`: Form for creating new content
- `ViewContent.tsx`: Detailed view of a content item
- `EditContent.tsx`: Form for editing existing content

---

#### Data Storage

- Uses **localStorage** to simulate backend functionality
- Data stored as **JSON strings**
- CRUD operations manipulate localStorage data directly
- Loads initial content from `mockData.json`

---

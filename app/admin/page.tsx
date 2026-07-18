"use client"

import { Fragment, useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"

import { supabase } from "@/lib/supabase/client"

type AdminProfileRow = {
  id: string | number
  full_name: string | null
  email: string | null
  role: string | null
  created_at: string | null
}

type BuyerProfileRow = {
  id: string | number
  full_name: string | null
  email: string | null
  phone: string | null
  role: string | null
  created_at: string | null
}

type PropertyRow = {
  id: string | number
  property_number: string | number | null
  buyer_id: string | number | null
  progress: string | number | null
  status: string | null
  created_at: string | null
}

type PropertyUpdateRow = {
  id: string | number
  property_id: string | number | null
  title: string | null
  description: string | null
  progress: string | number | null
  update_date: string | null
  created_at: string | null
}

type PropertyFileRow = {
  id: string | number
  property_id: string | number | null
  file_name: string | null
  file_path: string | null
  file_type: string | null
  description: string | null
  created_at: string | null
}

type ManagementFeedback = {
  tone: "success" | "error"
  message: string
}

type BuyerEditForm = {
  id: string
  fullName: string
  phone: string
}

type PropertyEditForm = {
  id: string
  propertyNumber: string
  buyerId: string
  progress: string
  status: string
}

type PropertyUpdateEditForm = {
  id: string
  title: string
  description: string
  progress: string
  updateDate: string
}

type PropertyFileEditForm = {
  id: string
  description: string
}

function formatValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "N/A"
  }

  return String(value)
}

function formatDate(value: string | null) {
  if (!value) {
    return "N/A"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

function formatProgressPercentage(
  progress: string | number | null | undefined,
) {
  if (progress === null || progress === undefined || progress === "") {
    return "N/A"
  }

  const value = String(progress)

  return value.includes("%") ? value : `${value}%`
}

function getProgressValue(progress: string | number | null | undefined) {
  if (progress === null || progress === undefined || progress === "") {
    return 0
  }

  const numericValue = Number.parseFloat(String(progress).replace("%", ""))

  if (Number.isNaN(numericValue)) {
    return 0
  }

  return Math.min(100, Math.max(0, numericValue))
}

function getTodayDateValue() {
  const now = new Date()
  const timezoneOffsetMinutes = now.getTimezoneOffset()
  const localDate = new Date(now.getTime() - timezoneOffsetMinutes * 60 * 1000)

  return localDate.toISOString().slice(0, 10)
}

function sanitizeFileName(fileName: string) {
  return fileName
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .toLowerCase()
}

export default function AdminOverviewPage() {
  const router = useRouter()
  const [adminProfile, setAdminProfile] = useState<AdminProfileRow | null>(null)
  const [buyers, setBuyers] = useState<BuyerProfileRow[]>([])
  const [properties, setProperties] = useState<PropertyRow[]>([])
  const [propertyUpdates, setPropertyUpdates] = useState<PropertyUpdateRow[]>([])
  const [propertyFiles, setPropertyFiles] = useState<PropertyFileRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [refreshIndex, setRefreshIndex] = useState(0)
  const [buyerFullName, setBuyerFullName] = useState("")
  const [buyerEmail, setBuyerEmail] = useState("")
  const [buyerPhone, setBuyerPhone] = useState("")
  const [buyerPassword, setBuyerPassword] = useState("")
  const [isCreatingBuyer, setIsCreatingBuyer] = useState(false)
  const [buyerError, setBuyerError] = useState<string | null>(null)
  const [buyerSuccess, setBuyerSuccess] = useState<string | null>(null)
  const [propertyNumber, setPropertyNumber] = useState("")
  const [propertyBuyerId, setPropertyBuyerId] = useState("")
  const [propertyProgress, setPropertyProgress] = useState("0")
  const [propertyStatus, setPropertyStatus] = useState("Under construction")
  const [isCreatingProperty, setIsCreatingProperty] = useState(false)
  const [propertyError, setPropertyError] = useState<string | null>(null)
  const [propertySuccess, setPropertySuccess] = useState<string | null>(null)
  const [propertyUpdatePropertyId, setPropertyUpdatePropertyId] = useState("")
  const [propertyUpdateTitle, setPropertyUpdateTitle] = useState("")
  const [propertyUpdateDescription, setPropertyUpdateDescription] = useState("")
  const [propertyUpdateProgress, setPropertyUpdateProgress] = useState("0")
  const [propertyUpdateDate, setPropertyUpdateDate] = useState(getTodayDateValue())
  const [isCreatingPropertyUpdate, setIsCreatingPropertyUpdate] = useState(false)
  const [propertyUpdateError, setPropertyUpdateError] = useState<string | null>(
    null,
  )
  const [propertyUpdateSuccess, setPropertyUpdateSuccess] = useState<
    string | null
  >(null)
  const [propertyFilePropertyId, setPropertyFilePropertyId] = useState("")
  const [propertyFileType, setPropertyFileType] = useState<"image" | "pdf">("image")
  const [propertyFileDescription, setPropertyFileDescription] = useState("")
  const [selectedPropertyFile, setSelectedPropertyFile] = useState<File | null>(null)
  const [propertyFileInputKey, setPropertyFileInputKey] = useState(0)
  const [isUploadingPropertyFile, setIsUploadingPropertyFile] = useState(false)
  const [propertyFileError, setPropertyFileError] = useState<string | null>(null)
  const [propertyFileSuccess, setPropertyFileSuccess] = useState<string | null>(
    null,
  )
  const [managementFeedback, setManagementFeedback] =
    useState<ManagementFeedback | null>(null)
  const [activeManagementAction, setActiveManagementAction] = useState<
    string | null
  >(null)
  const [buyerEditForm, setBuyerEditForm] = useState<BuyerEditForm | null>(null)
  const [propertyEditForm, setPropertyEditForm] =
    useState<PropertyEditForm | null>(null)
  const [propertyUpdateEditForm, setPropertyUpdateEditForm] =
    useState<PropertyUpdateEditForm | null>(null)
  const [propertyFileEditForm, setPropertyFileEditForm] =
    useState<PropertyFileEditForm | null>(null)

  useEffect(() => {
    let isActive = true

    const loadOverview = async () => {
      setError(null)
      setIsLoading(true)

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (!isActive) {
          return
        }

        if (userError || !user) {
          router.replace("/admin-login")
          return
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, full_name, email, role, created_at")
          .eq("id", user.id)
          .maybeSingle()

        if (!isActive) {
          return
        }

        if (profileError) {
          throw profileError
        }

        if (!profileData) {
          await supabase.auth.signOut()
          router.replace("/admin-login")
          return
        }

        if (String(profileData.role ?? "").toLowerCase() !== "admin") {
          router.replace("/client")
          return
        }

        setAdminProfile(profileData as AdminProfileRow)

        const [
          propertiesResult,
          buyersResult,
          updatesResult,
          propertyFilesResult,
        ] = await Promise.all([
          supabase
            .from("properties")
            .select("id, property_number, buyer_id, progress, status, created_at")
            .order("created_at", { ascending: false }),
          supabase
            .from("profiles")
            .select("id, full_name, email, phone, role, created_at")
            .eq("role", "client")
            .order("full_name", { ascending: true }),
          supabase
            .from("property_updates")
            .select(
              "id, property_id, title, description, progress, update_date, created_at",
            )
            .order("created_at", { ascending: false }),
          supabase
            .from("property_files")
            .select(
              "id, property_id, file_name, file_path, file_type, description, created_at",
            )
            .order("created_at", { ascending: false }),
        ])

        if (!isActive) {
          return
        }

        if (propertiesResult.error) {
          throw propertiesResult.error
        }

        if (buyersResult.error) {
          throw buyersResult.error
        }

        if (updatesResult.error) {
          throw updatesResult.error
        }

        if (propertyFilesResult.error) {
          throw propertyFilesResult.error
        }

        setProperties((propertiesResult.data ?? []) as PropertyRow[])
        setBuyers((buyersResult.data ?? []) as BuyerProfileRow[])
        setPropertyUpdates((updatesResult.data ?? []) as PropertyUpdateRow[])
        setPropertyFiles((propertyFilesResult.data ?? []) as PropertyFileRow[])
      } catch (caughtError) {
        if (isActive) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Could not load the admin overview.",
          )
          setAdminProfile(null)
          setProperties([])
          setBuyers([])
          setPropertyUpdates([])
          setPropertyFiles([])
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadOverview()

    return () => {
      isActive = false
    }
  }, [refreshIndex, router])

  const handleCreateBuyer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBuyerError(null)
    setBuyerSuccess(null)
    setIsCreatingBuyer(true)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.replace("/admin-login")
        return
      }

      const response = await fetch("/api/admin/buyers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          full_name: buyerFullName,
          email: buyerEmail,
          phone: buyerPhone,
          password: buyerPassword,
        }),
      })

      const payload = (await response.json().catch(() => null)) as
        | { buyer?: unknown; error?: string }
        | null

      if (!response.ok) {
        throw new Error(payload?.error ?? "Could not create the buyer.")
      }

      setBuyerFullName("")
      setBuyerEmail("")
      setBuyerPhone("")
      setBuyerPassword("")
      setBuyerSuccess("Buyer created successfully.")
      setRefreshIndex((value) => value + 1)
    } catch (caughtError) {
      setBuyerError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not create the buyer.",
      )
    } finally {
      setIsCreatingBuyer(false)
    }
  }

  const handleCreateProperty = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPropertyError(null)
    setPropertySuccess(null)
    setIsCreatingProperty(true)

    try {
      const propertyNumberValue = propertyNumber.trim()
      const buyerIdValue = propertyBuyerId.trim()
      const statusValue = propertyStatus.trim() || "Under construction"
      const progressValue = Number.parseInt(propertyProgress, 10)

      if (!propertyNumberValue) {
        throw new Error("Please add a property number.")
      }

      if (!buyerIdValue) {
        throw new Error("Please select a buyer.")
      }

      if (Number.isNaN(progressValue) || progressValue < 0 || progressValue > 100) {
        throw new Error("Progress must be a number between 0 and 100.")
      }

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.replace("/admin-login")
        return
      }

      const { data: insertedProperty, error: insertError } = await supabase
        .from("properties")
        .insert({
          property_number: propertyNumberValue,
          buyer_id: buyerIdValue,
          progress: progressValue,
          status: statusValue,
        })
        .select("id, property_number, buyer_id, progress, status, created_at")
        .single()

      if (insertError) {
        throw insertError
      }

      if (!insertedProperty) {
        throw new Error("Could not create the property.")
      }

      setProperties((current) => [insertedProperty as PropertyRow, ...current])
      setPropertyNumber("")
      setPropertyBuyerId("")
      setPropertyProgress("0")
      setPropertyStatus("Under construction")
      setPropertySuccess("Property created successfully.")
      setRefreshIndex((value) => value + 1)
    } catch (caughtError) {
      setPropertyError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not create the property.",
      )
    } finally {
      setIsCreatingProperty(false)
    }
  }

  const handleCreatePropertyUpdate = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()
    setPropertyUpdateError(null)
    setPropertyUpdateSuccess(null)
    setIsCreatingPropertyUpdate(true)

    try {
      const propertyIdValue = propertyUpdatePropertyId.trim()
      const titleValue = propertyUpdateTitle.trim()
      const descriptionValue = propertyUpdateDescription.trim()
      const updateDateValue = propertyUpdateDate.trim() || getTodayDateValue()
      const progressValue = Number.parseInt(propertyUpdateProgress, 10)

      if (!propertyIdValue) {
        throw new Error("Please select a property.")
      }

      if (!titleValue) {
        throw new Error("Please add a title.")
      }

      if (!descriptionValue) {
        throw new Error("Please add a description.")
      }

      if (Number.isNaN(progressValue) || progressValue < 0 || progressValue > 100) {
        throw new Error("Progress must be a number between 0 and 100.")
      }

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.replace("/admin-login")
        return
      }

      const { data: insertedUpdate, error: insertUpdateError } = await supabase
        .from("property_updates")
        .insert({
          property_id: propertyIdValue,
          title: titleValue,
          description: descriptionValue,
          progress: progressValue,
          update_date: updateDateValue,
        })
        .select("id, property_id, title, description, progress, update_date, created_at")
        .single()

      if (insertUpdateError) {
        throw insertUpdateError
      }

      if (!insertedUpdate) {
        throw new Error("Could not create the property update.")
      }

      const { error: updatePropertyError } = await supabase
        .from("properties")
        .update({ progress: progressValue })
        .eq("id", propertyIdValue)

      if (updatePropertyError) {
        throw updatePropertyError
      }

      setPropertyUpdates((current) => [
        insertedUpdate as PropertyUpdateRow,
        ...current,
      ])
      setProperties((current) =>
        current.map((property) =>
          String(property.id) === propertyIdValue
            ? { ...property, progress: progressValue }
            : property,
        ),
      )
      setPropertyUpdatePropertyId("")
      setPropertyUpdateTitle("")
      setPropertyUpdateDescription("")
      setPropertyUpdateProgress("0")
      setPropertyUpdateDate(getTodayDateValue())
      setPropertyUpdateSuccess("Property update created successfully.")
      setRefreshIndex((value) => value + 1)
    } catch (caughtError) {
      setPropertyUpdateError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not create the property update.",
      )
    } finally {
      setIsCreatingPropertyUpdate(false)
    }
  }

  const handleUploadPropertyFile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPropertyFileError(null)
    setPropertyFileSuccess(null)
    setIsUploadingPropertyFile(true)

    let uploadedFilePath: string | null = null

    try {
      const propertyIdValue = propertyFilePropertyId.trim()
      const descriptionValue = propertyFileDescription.trim()
      const file = selectedPropertyFile

      if (!propertyIdValue) {
        throw new Error("Please select a property.")
      }

      if (!file) {
        throw new Error("Please choose a file to upload.")
      }

      if (!descriptionValue) {
        throw new Error("Please add a description.")
      }

      const isPdfFile = propertyFileType === "pdf"
      const isImageFile = propertyFileType === "image"
      const fileMimeType = file.type.toLowerCase()

      if (isPdfFile && fileMimeType !== "application/pdf") {
        throw new Error("Please choose a PDF file for the PDF option.")
      }

      if (isImageFile && !fileMimeType.startsWith("image/")) {
        throw new Error("Please choose an image file for the image option.")
      }

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.replace("/admin-login")
        return
      }

      const safeFileName = sanitizeFileName(file.name) || "property-file"
      const filePath = `properties/${propertyIdValue}/${Date.now()}-${safeFileName}`
      uploadedFilePath = filePath

      const { error: uploadError } = await supabase.storage
        .from("property-files")
        .upload(filePath, file, {
          contentType:
            file.type || (isPdfFile ? "application/pdf" : "application/octet-stream"),
          upsert: false,
        })

      if (uploadError) {
        throw uploadError
      }

      const { data: insertedFile, error: insertFileError } = await supabase
        .from("property_files")
        .insert({
          property_id: propertyIdValue,
          file_name: file.name,
          file_path: filePath,
          file_type: propertyFileType,
          description: descriptionValue,
        })
        .select(
          "id, property_id, file_name, file_path, file_type, description, created_at",
        )
        .single()

      if (insertFileError) {
        throw insertFileError
      }

      if (!insertedFile) {
        throw new Error("Could not save the uploaded file.")
      }

      setPropertyFiles((current) => [insertedFile as PropertyFileRow, ...current])
      setPropertyFilePropertyId("")
      setPropertyFileType("image")
      setPropertyFileDescription("")
      setSelectedPropertyFile(null)
      setPropertyFileInputKey((value) => value + 1)
      setPropertyFileSuccess("Property file uploaded successfully.")
      setRefreshIndex((value) => value + 1)
    } catch (caughtError) {
      if (uploadedFilePath) {
        try {
          await supabase.storage.from("property-files").remove([uploadedFilePath])
        } catch {
          // Best-effort cleanup; the primary upload error is still shown below.
        }
      }

      setPropertyFileError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not upload the property file.",
      )
    } finally {
      setIsUploadingPropertyFile(false)
    }
  }

  const startBuyerEdit = (buyer: BuyerProfileRow) => {
    setManagementFeedback(null)
    setBuyerEditForm({
      id: String(buyer.id),
      fullName: buyer.full_name ?? "",
      phone: buyer.phone ?? "",
    })
  }

  const handleSaveBuyer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!buyerEditForm) {
      return
    }

    const fullName = buyerEditForm.fullName.trim()
    const phone = buyerEditForm.phone.trim()

    if (!fullName) {
      setManagementFeedback({
        tone: "error",
        message: "Buyer full name is required.",
      })
      return
    }

    const actionKey = `buyer:${buyerEditForm.id}`
    setActiveManagementAction(actionKey)
    setManagementFeedback(null)

    try {
      const { data: updatedBuyer, error: updateError } = await supabase
        .from("profiles")
        .update({ full_name: fullName, phone: phone || null })
        .eq("id", buyerEditForm.id)
        .eq("role", "client")
        .select("id")
        .maybeSingle()

      if (updateError) {
        throw updateError
      }

      if (!updatedBuyer) {
        throw new Error("The buyer could not be updated.")
      }

      setBuyerEditForm(null)
      setManagementFeedback({
        tone: "success",
        message: "Buyer changes saved successfully.",
      })
      setRefreshIndex((value) => value + 1)
    } catch (caughtError) {
      setManagementFeedback({
        tone: "error",
        message:
          caughtError instanceof Error
            ? caughtError.message
            : "Could not save the buyer changes.",
      })
    } finally {
      setActiveManagementAction(null)
    }
  }

  const startPropertyEdit = (property: PropertyRow) => {
    setManagementFeedback(null)
    setPropertyEditForm({
      id: String(property.id),
      propertyNumber: String(property.property_number ?? ""),
      buyerId: String(property.buyer_id ?? ""),
      progress: String(property.progress ?? "0").replace("%", ""),
      status: property.status ?? "",
    })
  }

  const handleSaveProperty = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!propertyEditForm) {
      return
    }

    const propertyNumber = propertyEditForm.propertyNumber.trim()
    const buyerId = propertyEditForm.buyerId.trim()
    const status = propertyEditForm.status.trim()
    const progress = Number.parseInt(propertyEditForm.progress, 10)

    if (!propertyNumber || !buyerId || !status) {
      setManagementFeedback({
        tone: "error",
        message: "Property number, buyer, and status are required.",
      })
      return
    }

    if (Number.isNaN(progress) || progress < 0 || progress > 100) {
      setManagementFeedback({
        tone: "error",
        message: "Progress must be a number between 0 and 100.",
      })
      return
    }

    const actionKey = `property:${propertyEditForm.id}`
    setActiveManagementAction(actionKey)
    setManagementFeedback(null)

    try {
      const { data: updatedProperty, error: updateError } = await supabase
        .from("properties")
        .update({
          property_number: propertyNumber,
          buyer_id: buyerId,
          progress,
          status,
        })
        .eq("id", propertyEditForm.id)
        .select("id")
        .maybeSingle()

      if (updateError) {
        throw updateError
      }

      if (!updatedProperty) {
        throw new Error("The property could not be updated.")
      }

      setPropertyEditForm(null)
      setManagementFeedback({
        tone: "success",
        message: "Property changes saved successfully.",
      })
      setRefreshIndex((value) => value + 1)
    } catch (caughtError) {
      setManagementFeedback({
        tone: "error",
        message:
          caughtError instanceof Error
            ? caughtError.message
            : "Could not save the property changes.",
      })
    } finally {
      setActiveManagementAction(null)
    }
  }

  const handleDeleteProperty = async (property: PropertyRow) => {
    const propertyLabel = formatValue(property.property_number)

    if (
      !window.confirm(
        `Are you sure? This will permanently delete property ${propertyLabel}, its updates, and its file records.`,
      )
    ) {
      return
    }

    const propertyId = String(property.id)
    const actionKey = `property:${propertyId}`
    let removedStorageFiles = false
    setActiveManagementAction(actionKey)
    setManagementFeedback(null)

    try {
      const { data: relatedFiles, error: relatedFilesError } = await supabase
        .from("property_files")
        .select("file_path")
        .eq("property_id", propertyId)

      if (relatedFilesError) {
        throw relatedFilesError
      }

      const filePaths = (relatedFiles ?? [])
        .map((file) => file.file_path)
        .filter((filePath): filePath is string => Boolean(filePath))

      if (filePaths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from("property-files")
          .remove(filePaths)

        if (storageError) {
          throw storageError
        }

        removedStorageFiles = true
      }

      const { data: deletedProperty, error: deleteError } = await supabase
        .from("properties")
        .delete()
        .eq("id", propertyId)
        .select("id")
        .maybeSingle()

      if (deleteError) {
        throw deleteError
      }

      if (!deletedProperty) {
        throw new Error("The property could not be deleted.")
      }

      setPropertyEditForm(null)
      setManagementFeedback({
        tone: "success",
        message: `Property ${propertyLabel} was deleted successfully.`,
      })
      setRefreshIndex((value) => value + 1)
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Could not delete the property."
      setManagementFeedback({
        tone: "error",
        message: removedStorageFiles
          ? `Storage files were removed, but the property row could not be deleted: ${message}`
          : message,
      })
    } finally {
      setActiveManagementAction(null)
    }
  }

  const startPropertyUpdateEdit = (update: PropertyUpdateRow) => {
    setManagementFeedback(null)
    setPropertyUpdateEditForm({
      id: String(update.id),
      title: update.title ?? "",
      description: update.description ?? "",
      progress: String(update.progress ?? "0").replace("%", ""),
      updateDate: update.update_date?.slice(0, 10) ?? getTodayDateValue(),
    })
  }

  const handleSavePropertyUpdate = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    if (!propertyUpdateEditForm) {
      return
    }

    const title = propertyUpdateEditForm.title.trim()
    const description = propertyUpdateEditForm.description.trim()
    const updateDate = propertyUpdateEditForm.updateDate.trim()
    const progress = Number.parseInt(propertyUpdateEditForm.progress, 10)

    if (!title || !description || !updateDate) {
      setManagementFeedback({
        tone: "error",
        message: "Title, description, and update date are required.",
      })
      return
    }

    if (Number.isNaN(progress) || progress < 0 || progress > 100) {
      setManagementFeedback({
        tone: "error",
        message: "Progress must be a number between 0 and 100.",
      })
      return
    }

    const actionKey = `update:${propertyUpdateEditForm.id}`
    setActiveManagementAction(actionKey)
    setManagementFeedback(null)

    try {
      const { data: updatedRecord, error: updateError } = await supabase
        .from("property_updates")
        .update({ title, description, progress, update_date: updateDate })
        .eq("id", propertyUpdateEditForm.id)
        .select("id")
        .maybeSingle()

      if (updateError) {
        throw updateError
      }

      if (!updatedRecord) {
        throw new Error("The property update could not be updated.")
      }

      setPropertyUpdateEditForm(null)
      setManagementFeedback({
        tone: "success",
        message: "Property update changes saved successfully.",
      })
      setRefreshIndex((value) => value + 1)
    } catch (caughtError) {
      setManagementFeedback({
        tone: "error",
        message:
          caughtError instanceof Error
            ? caughtError.message
            : "Could not save the property update changes.",
      })
    } finally {
      setActiveManagementAction(null)
    }
  }

  const handleDeletePropertyUpdate = async (update: PropertyUpdateRow) => {
    if (!window.confirm("Are you sure? This property update will be deleted.")) {
      return
    }

    const updateId = String(update.id)
    const actionKey = `update:${updateId}`
    setActiveManagementAction(actionKey)
    setManagementFeedback(null)

    try {
      const { data: deletedUpdate, error: deleteError } = await supabase
        .from("property_updates")
        .delete()
        .eq("id", updateId)
        .select("id")
        .maybeSingle()

      if (deleteError) {
        throw deleteError
      }

      if (!deletedUpdate) {
        throw new Error("The property update could not be deleted.")
      }

      setPropertyUpdateEditForm(null)
      setManagementFeedback({
        tone: "success",
        message: "Property update deleted successfully.",
      })
      setRefreshIndex((value) => value + 1)
    } catch (caughtError) {
      setManagementFeedback({
        tone: "error",
        message:
          caughtError instanceof Error
            ? caughtError.message
            : "Could not delete the property update.",
      })
    } finally {
      setActiveManagementAction(null)
    }
  }

  const startPropertyFileEdit = (propertyFile: PropertyFileRow) => {
    setManagementFeedback(null)
    setPropertyFileEditForm({
      id: String(propertyFile.id),
      description: propertyFile.description ?? "",
    })
  }

  const handleSavePropertyFile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!propertyFileEditForm) {
      return
    }

    const description = propertyFileEditForm.description.trim()

    if (!description) {
      setManagementFeedback({
        tone: "error",
        message: "File description is required.",
      })
      return
    }

    const actionKey = `file:${propertyFileEditForm.id}`
    setActiveManagementAction(actionKey)
    setManagementFeedback(null)

    try {
      const { data: updatedFile, error: updateError } = await supabase
        .from("property_files")
        .update({ description })
        .eq("id", propertyFileEditForm.id)
        .select("id")
        .maybeSingle()

      if (updateError) {
        throw updateError
      }

      if (!updatedFile) {
        throw new Error("The file description could not be updated.")
      }

      setPropertyFileEditForm(null)
      setManagementFeedback({
        tone: "success",
        message: "File description saved successfully.",
      })
      setRefreshIndex((value) => value + 1)
    } catch (caughtError) {
      setManagementFeedback({
        tone: "error",
        message:
          caughtError instanceof Error
            ? caughtError.message
            : "Could not save the file description.",
      })
    } finally {
      setActiveManagementAction(null)
    }
  }

  const handleDeletePropertyFile = async (propertyFile: PropertyFileRow) => {
    if (
      !window.confirm(
        `Are you sure? ${formatValue(propertyFile.file_name)} will be permanently deleted.`,
      )
    ) {
      return
    }

    const fileId = String(propertyFile.id)
    const actionKey = `file:${fileId}`
    let removedStorageFile = false
    setActiveManagementAction(actionKey)
    setManagementFeedback(null)

    try {
      if (propertyFile.file_path) {
        const { error: storageError } = await supabase.storage
          .from("property-files")
          .remove([propertyFile.file_path])

        if (storageError) {
          throw storageError
        }

        removedStorageFile = true
      }

      const { data: deletedFile, error: deleteError } = await supabase
        .from("property_files")
        .delete()
        .eq("id", fileId)
        .select("id")
        .maybeSingle()

      if (deleteError) {
        throw deleteError
      }

      if (!deletedFile) {
        throw new Error("The property file row could not be deleted.")
      }

      setPropertyFileEditForm(null)
      setManagementFeedback({
        tone: "success",
        message: "Property file deleted from Storage and records successfully.",
      })
      setRefreshIndex((value) => value + 1)
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Could not delete the property file."
      setManagementFeedback({
        tone: "error",
        message: removedStorageFile
          ? `The Storage object was removed, but its database row could not be deleted: ${message}`
          : message,
      })
    } finally {
      setActiveManagementAction(null)
    }
  }

  const handleLogout = async () => {
    setLoading(true)
    setError(null)

    try {
      const { error: signOutError } = await supabase.auth.signOut()

      if (signOutError) {
        throw signOutError
      }

      router.replace("/admin-login")
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not sign out right now.",
      )
    } finally {
      setLoading(false)
    }
  }

  const buyerById = buyers.reduce<Record<string, BuyerProfileRow>>((acc, buyer) => {
    acc[String(buyer.id)] = buyer
    return acc
  }, {})

  const propertyById = properties.reduce<Record<string, PropertyRow>>(
    (acc, property) => {
      acc[String(property.id)] = property
      return acc
    },
    {},
  )

  const propertyCountByBuyerId = properties.reduce<Record<string, number>>(
    (acc, property) => {
      const buyerId = String(property.buyer_id ?? "")

      if (!buyerId) {
        return acc
      }

      acc[buyerId] = (acc[buyerId] ?? 0) + 1
      return acc
    },
    {},
  )

  const updateCountByPropertyId = propertyUpdates.reduce<
    Record<string, number>
  >((acc, update) => {
    const propertyId = String(update.property_id ?? "")

    if (!propertyId) {
      return acc
    }

    acc[propertyId] = (acc[propertyId] ?? 0) + 1
    return acc
  }, {})

  const fileCountByPropertyId = propertyFiles.reduce<Record<string, number>>(
    (acc, propertyFile) => {
      const propertyId = String(propertyFile.property_id ?? "")

      if (!propertyId) {
        return acc
      }

      acc[propertyId] = (acc[propertyId] ?? 0) + 1
      return acc
    },
    {},
  )

  const totalProperties = properties.length
  const totalBuyers = buyers.length
  const totalUpdates = propertyUpdates.length
  const totalFiles = propertyFiles.length
  const primaryButtonClass =
    "inline-flex items-center justify-center rounded-full bg-linear-to-b from-luxury-gold-soft to-luxury-gold px-5 py-3 text-sm font-semibold text-stone-950 shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
  const secondaryButtonClass =
    "inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
  const smallSecondaryButtonClass =
    "inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
  const smallDeleteButtonClass =
    "inline-flex items-center justify-center rounded-full border border-rose-200 bg-white px-4 py-2 text-xs font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 sm:gap-8">
        <section className="luxury-panel rounded-3xl p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <span className="luxury-eyebrow inline-flex items-center rounded-full border border-luxury-border bg-white px-3 py-1.5 text-[0.7rem] font-semibold text-slate-600">
                Admin overview
              </span>
              <div className="space-y-3">
                <h1 className="luxury-title-sm text-slate-950">
                  Reina Sophia Admin Dashboard
                </h1>
                <p className="luxury-copy max-w-3xl text-sm sm:text-base">
                  Manage buyers, properties, construction updates, and files.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loading}
              className={secondaryButtonClass}
            >
              {loading ? "Signing out..." : "Log out"}
            </button>
          </div>

          {error ? (
            <div
              className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
              aria-live="polite"
            >
              {error}
            </div>
          ) : null}

          {managementFeedback ? (
            <div
              className={`fixed right-4 bottom-4 z-50 max-w-sm rounded-2xl border px-4 py-3 text-sm shadow-xl sm:right-6 sm:bottom-6 ${
                managementFeedback.tone === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-rose-200 bg-rose-50 text-rose-700"
              }`}
              aria-live="polite"
            >
              {managementFeedback.message}
            </div>
          ) : null}
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="luxury-card rounded-3xl p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Admin
            </p>
            <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">
              {formatValue(adminProfile?.full_name)}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {formatValue(adminProfile?.email)}
            </p>
          </div>

          <div className="luxury-card rounded-3xl p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Properties
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              {totalProperties}
            </p>
            <p className="mt-2 text-sm text-slate-600">Active records</p>
          </div>

          <div className="luxury-card rounded-3xl p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Buyers
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              {totalBuyers}
            </p>
            <p className="mt-2 text-sm text-slate-600">Client accounts</p>
          </div>

          <div className="luxury-card rounded-3xl p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Updates
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              {totalUpdates}
            </p>
            <p className="mt-2 text-sm text-slate-600">Timeline entries</p>
          </div>

          <div className="luxury-card rounded-3xl p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Files
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              {totalFiles}
            </p>
            <p className="mt-2 text-sm text-slate-600">Private uploads</p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                Create buyer
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Secure buyer creation
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-slate-600">
                Temporary admin form for creating authenticated buyer accounts.
              </p>
            </div>
          </div>

          <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleCreateBuyer}>
            <div className="space-y-2">
              <label
                htmlFor="buyer-full-name"
                className="text-sm font-medium text-slate-700"
              >
                Full name
              </label>
              <input
                id="buyer-full-name"
                type="text"
                value={buyerFullName}
                onChange={(event) => setBuyerFullName(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                placeholder="Buyer name"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="buyer-email"
                className="text-sm font-medium text-slate-700"
              >
                Email
              </label>
              <input
                id="buyer-email"
                type="email"
                autoComplete="email"
                value={buyerEmail}
                onChange={(event) => setBuyerEmail(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                placeholder="buyer@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="buyer-phone"
                className="text-sm font-medium text-slate-700"
              >
                Phone
              </label>
              <input
                id="buyer-phone"
                type="tel"
                autoComplete="tel"
                value={buyerPhone}
                onChange={(event) => setBuyerPhone(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                placeholder="+1 555 000 0000"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="buyer-password"
                className="text-sm font-medium text-slate-700"
              >
                Temporary password
              </label>
              <input
                id="buyer-password"
                type="password"
                autoComplete="new-password"
                value={buyerPassword}
                onChange={(event) => setBuyerPassword(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                placeholder="Temporary password"
                required
              />
            </div>

            {buyerError ? (
              <div
                className="md:col-span-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                aria-live="polite"
              >
                {buyerError}
              </div>
            ) : null}

            {buyerSuccess ? (
              <div
                className="md:col-span-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                aria-live="polite"
              >
                {buyerSuccess}
              </div>
            ) : null}

            <div className="md:col-span-2 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={isCreatingBuyer}
                className={primaryButtonClass}
              >
                {isCreatingBuyer ? "Creating buyer..." : "Create Buyer"}
              </button>
              <span className="text-sm text-slate-500">
                This creates a client auth user and profile row.
              </span>
            </div>
          </form>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                Create property
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                New property record
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-slate-600">
                Temporary admin form for adding a property and assigning it to a
                buyer.
              </p>
            </div>
          </div>

          <form
            className="mt-6 grid gap-4 md:grid-cols-2"
            onSubmit={handleCreateProperty}
          >
            <div className="space-y-2">
              <label
                htmlFor="property-number"
                className="text-sm font-medium text-slate-700"
              >
                Property number
              </label>
              <input
                id="property-number"
                type="text"
                value={propertyNumber}
                onChange={(event) => setPropertyNumber(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                placeholder="A-101"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="property-buyer"
                className="text-sm font-medium text-slate-700"
              >
                Buyer
              </label>
              <select
                id="property-buyer"
                value={propertyBuyerId}
                onChange={(event) => setPropertyBuyerId(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                required
                disabled={buyers.length === 0}
              >
                <option value="">Select a buyer</option>
                {buyers.map((buyer) => (
                  <option key={String(buyer.id)} value={String(buyer.id)}>
                    {formatValue(buyer.full_name)} ({formatValue(buyer.email)})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="property-progress"
                className="text-sm font-medium text-slate-700"
              >
                Progress
              </label>
              <input
                id="property-progress"
                type="number"
                min={0}
                max={100}
                value={propertyProgress}
                onChange={(event) => setPropertyProgress(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="property-status"
                className="text-sm font-medium text-slate-700"
              >
                Status
              </label>
              <input
                id="property-status"
                type="text"
                value={propertyStatus}
                onChange={(event) => setPropertyStatus(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                placeholder="En construcción"
                required
              />
            </div>

            {propertyError ? (
              <div
                className="md:col-span-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                aria-live="polite"
              >
                {propertyError}
              </div>
            ) : null}

            {propertySuccess ? (
              <div
                className="md:col-span-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                aria-live="polite"
              >
                {propertySuccess}
              </div>
            ) : null}

            <div className="md:col-span-2 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={isCreatingProperty || buyers.length === 0}
                className={primaryButtonClass}
              >
                {isCreatingProperty ? "Creating property..." : "Create Property"}
              </button>
              <span className="text-sm text-slate-500">
                This uses the admin session and respects row-level security.
              </span>
            </div>
          </form>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                Create property update
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                New timeline update
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-slate-600">
                Temporary admin form for adding a property update and syncing the
                property progress.
              </p>
            </div>
          </div>

          <form
            className="mt-6 grid gap-4 md:grid-cols-2"
            onSubmit={handleCreatePropertyUpdate}
          >
            <div className="space-y-2">
              <label
                htmlFor="property-update-property"
                className="text-sm font-medium text-slate-700"
              >
                Property
              </label>
              <select
                id="property-update-property"
                value={propertyUpdatePropertyId}
                onChange={(event) =>
                  setPropertyUpdatePropertyId(event.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                required
                disabled={properties.length === 0}
              >
                <option value="">Select a property</option>
                {properties.map((property) => {
                  const buyer = buyerById[String(property.buyer_id ?? "")]

                  return (
                    <option key={String(property.id)} value={String(property.id)}>
                      {formatValue(property.property_number)}
                      {buyer?.full_name ? ` - ${formatValue(buyer.full_name)}` : ""}
                    </option>
                  )
                })}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="property-update-title"
                className="text-sm font-medium text-slate-700"
              >
                Title
              </label>
              <input
                id="property-update-title"
                type="text"
                value={propertyUpdateTitle}
                onChange={(event) => setPropertyUpdateTitle(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                placeholder="Foundation progress"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="property-update-description"
                className="text-sm font-medium text-slate-700"
              >
                Description
              </label>
              <textarea
                id="property-update-description"
                value={propertyUpdateDescription}
                onChange={(event) =>
                  setPropertyUpdateDescription(event.target.value)
                }
                className="min-h-32 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                placeholder="Short summary of the latest progress"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="property-update-progress"
                className="text-sm font-medium text-slate-700"
              >
                Progress
              </label>
              <input
                id="property-update-progress"
                type="number"
                min={0}
                max={100}
                value={propertyUpdateProgress}
                onChange={(event) =>
                  setPropertyUpdateProgress(event.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="property-update-date"
                className="text-sm font-medium text-slate-700"
              >
                Update date
              </label>
              <input
                id="property-update-date"
                type="date"
                value={propertyUpdateDate}
                onChange={(event) => setPropertyUpdateDate(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                required
              />
            </div>

            {propertyUpdateError ? (
              <div
                className="md:col-span-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                aria-live="polite"
              >
                {propertyUpdateError}
              </div>
            ) : null}

            {propertyUpdateSuccess ? (
              <div
                className="md:col-span-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                aria-live="polite"
              >
                {propertyUpdateSuccess}
              </div>
            ) : null}

            <div className="md:col-span-2 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={isCreatingPropertyUpdate || properties.length === 0}
                className={primaryButtonClass}
              >
                {isCreatingPropertyUpdate
                  ? "Creating update..."
                  : "Create Property Update"}
              </button>
              <span className="text-sm text-slate-500">
                This updates the timeline and keeps property progress in sync.
              </span>
            </div>
          </form>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                Upload property file
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Add images or PDFs
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-slate-600">
                Temporary admin form for attaching a private file to a property.
              </p>
            </div>
          </div>

          <form
            className="mt-6 grid gap-4 md:grid-cols-2"
            onSubmit={handleUploadPropertyFile}
          >
            <div className="space-y-2">
              <label
                htmlFor="property-file-property"
                className="text-sm font-medium text-slate-700"
              >
                Property
              </label>
              <select
                id="property-file-property"
                value={propertyFilePropertyId}
                onChange={(event) => setPropertyFilePropertyId(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                required
                disabled={properties.length === 0}
              >
                <option value="">Select a property</option>
                {properties.map((property) => (
                  <option key={String(property.id)} value={String(property.id)}>
                    {formatValue(property.property_number)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="property-file-type"
                className="text-sm font-medium text-slate-700"
              >
                File type
              </label>
              <select
                id="property-file-type"
                value={propertyFileType}
                onChange={(event) =>
                  setPropertyFileType(event.target.value as "image" | "pdf")
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                required
              >
                <option value="image">image</option>
                <option value="pdf">pdf</option>
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="property-file-upload"
                className="text-sm font-medium text-slate-700"
              >
                File
              </label>
              <input
                key={propertyFileInputKey}
                id="property-file-upload"
                type="file"
                accept="image/*,application/pdf"
                onChange={(event) => {
                  setSelectedPropertyFile(event.target.files?.[0] ?? null)
                }}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="property-file-description"
                className="text-sm font-medium text-slate-700"
              >
                Description
              </label>
              <textarea
                id="property-file-description"
                value={propertyFileDescription}
                onChange={(event) => setPropertyFileDescription(event.target.value)}
                className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                placeholder="Short description for this file"
                required
              />
            </div>

            {propertyFileError ? (
              <div
                className="md:col-span-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                aria-live="polite"
              >
                {propertyFileError}
              </div>
            ) : null}

            {propertyFileSuccess ? (
              <div
                className="md:col-span-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                aria-live="polite"
              >
                {propertyFileSuccess}
              </div>
            ) : null}

            <div className="md:col-span-2 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={isUploadingPropertyFile || properties.length === 0}
                className={primaryButtonClass}
              >
                {isUploadingPropertyFile ? "Uploading file..." : "Upload Property File"}
              </button>
              <span className="text-sm text-slate-500">
                Files upload privately to Supabase Storage.
              </span>
            </div>
          </form>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                Buyers
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Client accounts
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-slate-600">
                Overview of buyers currently stored in the system and their
                assigned properties.
              </p>
            </div>
          </div>

          {buyers.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
              No buyers created yet.
            </div>
          ) : (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {buyers.map((buyer) => {
                const assignedPropertyCount =
                  propertyCountByBuyerId[String(buyer.id)] ?? 0

                return (
                  <article
                    key={String(buyer.id)}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-1">
                        <h3 className="text-xl font-semibold tracking-tight text-slate-950">
                          {formatValue(buyer.full_name)}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {formatValue(buyer.email)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium uppercase tracking-widest text-slate-600">
                          Buyer
                        </span>
                        <button
                          type="button"
                          className={smallSecondaryButtonClass}
                          onClick={() => startBuyerEdit(buyer)}
                          disabled={activeManagementAction !== null}
                        >
                          Edit
                        </button>
                      </div>
                    </div>

                    {buyerEditForm?.id === String(buyer.id) ? (
                      <form
                        className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2"
                        onSubmit={handleSaveBuyer}
                      >
                        <div className="space-y-2">
                          <label
                            htmlFor={`buyer-edit-name-${buyer.id}`}
                            className="text-sm font-medium text-slate-700"
                          >
                            Full name
                          </label>
                          <input
                            id={`buyer-edit-name-${buyer.id}`}
                            type="text"
                            value={buyerEditForm.fullName}
                            onChange={(event) =>
                              setBuyerEditForm((current) =>
                                current
                                  ? { ...current, fullName: event.target.value }
                                  : current,
                              )
                            }
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor={`buyer-edit-phone-${buyer.id}`}
                            className="text-sm font-medium text-slate-700"
                          >
                            Phone
                          </label>
                          <input
                            id={`buyer-edit-phone-${buyer.id}`}
                            type="tel"
                            value={buyerEditForm.phone}
                            onChange={(event) =>
                              setBuyerEditForm((current) =>
                                current
                                  ? { ...current, phone: event.target.value }
                                  : current,
                              )
                            }
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                          />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <label
                            htmlFor={`buyer-edit-email-${buyer.id}`}
                            className="text-sm font-medium text-slate-700"
                          >
                            Email (read-only)
                          </label>
                          <input
                            id={`buyer-edit-email-${buyer.id}`}
                            type="email"
                            value={buyer.email ?? ""}
                            readOnly
                            className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500 outline-none"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2 sm:col-span-2">
                          <button
                            type="submit"
                            className={primaryButtonClass}
                            disabled={
                              activeManagementAction === `buyer:${buyer.id}`
                            }
                          >
                            {activeManagementAction === `buyer:${buyer.id}`
                              ? "Saving..."
                              : "Save changes"}
                          </button>
                          <button
                            type="button"
                            className={secondaryButtonClass}
                            onClick={() => setBuyerEditForm(null)}
                            disabled={activeManagementAction !== null}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                            Phone
                          </p>
                          <p className="mt-2 text-sm text-slate-700">
                            {formatValue(buyer.phone)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                            Created
                          </p>
                          <p className="mt-2 text-sm text-slate-700">
                            {formatDate(buyer.created_at)}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="mt-6 border-t border-slate-100 pt-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                        Assigned properties
                      </p>
                      <p className="mt-2 text-sm text-slate-700">
                        {assignedPropertyCount > 0
                          ? `${assignedPropertyCount} assigned ${
                              assignedPropertyCount === 1 ? "property" : "properties"
                            }`
                          : "No properties assigned"}
                      </p>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          {isLoading ? (
            <div className="p-8 text-sm text-slate-600">Loading admin overview...</div>
          ) : totalProperties === 0 ? (
            <div className="p-8">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
                No properties found yet.
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    <th scope="col" className="px-6 py-4">
                      Property
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Buyer
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Progress
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Updates
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Files
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Created
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {properties.map((property) => {
                    const buyer = buyerById[String(property.buyer_id ?? "")]
                    const progressValue = getProgressValue(property.progress)
                    const updateCount =
                      updateCountByPropertyId[String(property.id)] ?? 0
                    const fileCount = fileCountByPropertyId[String(property.id)] ?? 0

                    return (
                      <Fragment key={String(property.id)}>
                      <tr className="hover:bg-slate-50/70">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-950">
                            {formatValue(property.property_number)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-700">
                          {formatValue(buyer?.full_name)}
                        </td>
                        <td className="px-6 py-4 text-slate-700">
                          {formatValue(buyer?.email)}
                        </td>
                        <td className="px-6 py-4 text-slate-700">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                              <span>{formatProgressPercentage(property.progress)}</span>
                            </div>
                            <div className="h-2 w-40 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-linear-to-r from-slate-700 to-slate-950"
                                style={{ width: `${progressValue}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-600">
                            {formatValue(property.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-700">
                          {updateCount}
                        </td>
                        <td className="px-6 py-4 text-slate-700">
                          {fileCount}
                        </td>
                        <td className="px-6 py-4 text-slate-700">
                          {formatDate(property.created_at)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className={smallSecondaryButtonClass}
                              onClick={() => startPropertyEdit(property)}
                              disabled={activeManagementAction !== null}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className={smallDeleteButtonClass}
                              onClick={() => handleDeleteProperty(property)}
                              disabled={activeManagementAction !== null}
                            >
                              {activeManagementAction === `property:${property.id}`
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                      {propertyEditForm?.id === String(property.id) ? (
                        <tr className="bg-slate-50">
                          <td colSpan={9} className="px-6 py-5">
                            <form
                              className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-2 xl:grid-cols-4"
                              onSubmit={handleSaveProperty}
                            >
                              <div className="space-y-2">
                                <label
                                  htmlFor={`property-edit-number-${property.id}`}
                                  className="text-sm font-medium text-slate-700"
                                >
                                  Property number
                                </label>
                                <input
                                  id={`property-edit-number-${property.id}`}
                                  type="text"
                                  value={propertyEditForm.propertyNumber}
                                  onChange={(event) =>
                                    setPropertyEditForm((current) =>
                                      current
                                        ? {
                                            ...current,
                                            propertyNumber: event.target.value,
                                          }
                                        : current,
                                    )
                                  }
                                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <label
                                  htmlFor={`property-edit-buyer-${property.id}`}
                                  className="text-sm font-medium text-slate-700"
                                >
                                  Buyer
                                </label>
                                <select
                                  id={`property-edit-buyer-${property.id}`}
                                  value={propertyEditForm.buyerId}
                                  onChange={(event) =>
                                    setPropertyEditForm((current) =>
                                      current
                                        ? { ...current, buyerId: event.target.value }
                                        : current,
                                    )
                                  }
                                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                                  required
                                >
                                  <option value="">Select a buyer</option>
                                  {buyers.map((buyerOption) => (
                                    <option
                                      key={String(buyerOption.id)}
                                      value={String(buyerOption.id)}
                                    >
                                      {formatValue(buyerOption.full_name)} (
                                      {formatValue(buyerOption.email)})
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="space-y-2">
                                <label
                                  htmlFor={`property-edit-progress-${property.id}`}
                                  className="text-sm font-medium text-slate-700"
                                >
                                  Progress
                                </label>
                                <input
                                  id={`property-edit-progress-${property.id}`}
                                  type="number"
                                  min={0}
                                  max={100}
                                  value={propertyEditForm.progress}
                                  onChange={(event) =>
                                    setPropertyEditForm((current) =>
                                      current
                                        ? { ...current, progress: event.target.value }
                                        : current,
                                    )
                                  }
                                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <label
                                  htmlFor={`property-edit-status-${property.id}`}
                                  className="text-sm font-medium text-slate-700"
                                >
                                  Status
                                </label>
                                <input
                                  id={`property-edit-status-${property.id}`}
                                  type="text"
                                  value={propertyEditForm.status}
                                  onChange={(event) =>
                                    setPropertyEditForm((current) =>
                                      current
                                        ? { ...current, status: event.target.value }
                                        : current,
                                    )
                                  }
                                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                                  required
                                />
                              </div>
                              <div className="flex flex-wrap gap-2 md:col-span-2 xl:col-span-4">
                                <button
                                  type="submit"
                                  className={primaryButtonClass}
                                  disabled={
                                    activeManagementAction ===
                                    `property:${property.id}`
                                  }
                                >
                                  {activeManagementAction ===
                                  `property:${property.id}`
                                    ? "Saving..."
                                    : "Save changes"}
                                </button>
                                <button
                                  type="button"
                                  className={secondaryButtonClass}
                                  onClick={() => setPropertyEditForm(null)}
                                  disabled={activeManagementAction !== null}
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </td>
                        </tr>
                      ) : null}
                      </Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <details>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-8">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Property updates
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                  Manage timeline updates
                </h2>
                <p className="text-sm leading-6 text-slate-600">
                  Expand to edit or delete existing construction updates.
                </p>
              </div>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                {totalUpdates} {totalUpdates === 1 ? "update" : "updates"}
              </span>
            </summary>

            <div className="border-t border-slate-100 p-8 pt-6">
              {propertyUpdates.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
                  No property updates created yet.
                </div>
              ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                  {propertyUpdates.map((update) => {
                    const property =
                      propertyById[String(update.property_id ?? "")]
                    const actionKey = `update:${update.id}`

                    return (
                      <article
                        key={String(update.id)}
                        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                              Property {formatValue(property?.property_number)}
                            </p>
                            <h3 className="text-lg font-semibold text-slate-950">
                              {formatValue(update.title)}
                            </h3>
                            <p className="text-sm text-slate-500">
                              {formatDate(update.update_date)}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              className={smallSecondaryButtonClass}
                              onClick={() => startPropertyUpdateEdit(update)}
                              disabled={activeManagementAction !== null}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className={smallDeleteButtonClass}
                              onClick={() => handleDeletePropertyUpdate(update)}
                              disabled={activeManagementAction !== null}
                            >
                              {activeManagementAction === actionKey
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </div>

                        {propertyUpdateEditForm?.id === String(update.id) ? (
                          <form
                            className="mt-5 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2"
                            onSubmit={handleSavePropertyUpdate}
                          >
                            <div className="space-y-2 sm:col-span-2">
                              <label
                                htmlFor={`update-edit-title-${update.id}`}
                                className="text-sm font-medium text-slate-700"
                              >
                                Title
                              </label>
                              <input
                                id={`update-edit-title-${update.id}`}
                                type="text"
                                value={propertyUpdateEditForm.title}
                                onChange={(event) =>
                                  setPropertyUpdateEditForm((current) =>
                                    current
                                      ? { ...current, title: event.target.value }
                                      : current,
                                  )
                                }
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                                required
                              />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                              <label
                                htmlFor={`update-edit-description-${update.id}`}
                                className="text-sm font-medium text-slate-700"
                              >
                                Description
                              </label>
                              <textarea
                                id={`update-edit-description-${update.id}`}
                                value={propertyUpdateEditForm.description}
                                onChange={(event) =>
                                  setPropertyUpdateEditForm((current) =>
                                    current
                                      ? {
                                          ...current,
                                          description: event.target.value,
                                        }
                                      : current,
                                  )
                                }
                                className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor={`update-edit-progress-${update.id}`}
                                className="text-sm font-medium text-slate-700"
                              >
                                Progress
                              </label>
                              <input
                                id={`update-edit-progress-${update.id}`}
                                type="number"
                                min={0}
                                max={100}
                                value={propertyUpdateEditForm.progress}
                                onChange={(event) =>
                                  setPropertyUpdateEditForm((current) =>
                                    current
                                      ? { ...current, progress: event.target.value }
                                      : current,
                                  )
                                }
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor={`update-edit-date-${update.id}`}
                                className="text-sm font-medium text-slate-700"
                              >
                                Update date
                              </label>
                              <input
                                id={`update-edit-date-${update.id}`}
                                type="date"
                                value={propertyUpdateEditForm.updateDate}
                                onChange={(event) =>
                                  setPropertyUpdateEditForm((current) =>
                                    current
                                      ? { ...current, updateDate: event.target.value }
                                      : current,
                                  )
                                }
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                                required
                              />
                            </div>
                            <div className="flex flex-wrap gap-2 sm:col-span-2">
                              <button
                                type="submit"
                                className={primaryButtonClass}
                                disabled={activeManagementAction === actionKey}
                              >
                                {activeManagementAction === actionKey
                                  ? "Saving..."
                                  : "Save changes"}
                              </button>
                              <button
                                type="button"
                                className={secondaryButtonClass}
                                onClick={() => setPropertyUpdateEditForm(null)}
                                disabled={activeManagementAction !== null}
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="mt-5 space-y-4 border-t border-slate-100 pt-4">
                            <p className="text-sm leading-6 text-slate-700">
                              {formatValue(update.description)}
                            </p>
                            <p className="text-sm font-semibold text-slate-600">
                              Progress: {formatProgressPercentage(update.progress)}
                            </p>
                          </div>
                        )}
                      </article>
                    )
                  })}
                </div>
              )}
            </div>
          </details>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <details>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-8">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Property files
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                  Manage uploaded files
                </h2>
                <p className="text-sm leading-6 text-slate-600">
                  Expand to edit descriptions or remove files from Storage.
                </p>
              </div>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                {totalFiles} {totalFiles === 1 ? "file" : "files"}
              </span>
            </summary>

            <div className="border-t border-slate-100 p-8 pt-6">
              {propertyFiles.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
                  No property files uploaded yet.
                </div>
              ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                  {propertyFiles.map((propertyFile) => {
                    const property =
                      propertyById[String(propertyFile.property_id ?? "")]
                    const actionKey = `file:${propertyFile.id}`

                    return (
                      <article
                        key={String(propertyFile.id)}
                        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0 space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                              Property {formatValue(property?.property_number)}
                            </p>
                            <h3 className="truncate text-lg font-semibold text-slate-950">
                              {formatValue(propertyFile.file_name)}
                            </h3>
                            <p className="text-sm text-slate-500">
                              {formatValue(propertyFile.file_type)} ·{" "}
                              {formatDate(propertyFile.created_at)}
                            </p>
                          </div>
                          <div className="flex shrink-0 flex-wrap gap-2">
                            <button
                              type="button"
                              className={smallSecondaryButtonClass}
                              onClick={() => startPropertyFileEdit(propertyFile)}
                              disabled={activeManagementAction !== null}
                            >
                              Edit description
                            </button>
                            <button
                              type="button"
                              className={smallDeleteButtonClass}
                              onClick={() => handleDeletePropertyFile(propertyFile)}
                              disabled={activeManagementAction !== null}
                            >
                              {activeManagementAction === actionKey
                                ? "Deleting..."
                                : "Delete file"}
                            </button>
                          </div>
                        </div>

                        {propertyFileEditForm?.id === String(propertyFile.id) ? (
                          <form
                            className="mt-5 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                            onSubmit={handleSavePropertyFile}
                          >
                            <div className="space-y-2">
                              <label
                                htmlFor={`file-edit-description-${propertyFile.id}`}
                                className="text-sm font-medium text-slate-700"
                              >
                                Description
                              </label>
                              <textarea
                                id={`file-edit-description-${propertyFile.id}`}
                                value={propertyFileEditForm.description}
                                onChange={(event) =>
                                  setPropertyFileEditForm((current) =>
                                    current
                                      ? {
                                          ...current,
                                          description: event.target.value,
                                        }
                                      : current,
                                  )
                                }
                                className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                                required
                              />
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="submit"
                                className={primaryButtonClass}
                                disabled={activeManagementAction === actionKey}
                              >
                                {activeManagementAction === actionKey
                                  ? "Saving..."
                                  : "Save changes"}
                              </button>
                              <button
                                type="button"
                                className={secondaryButtonClass}
                                onClick={() => setPropertyFileEditForm(null)}
                                disabled={activeManagementAction !== null}
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <p className="mt-5 border-t border-slate-100 pt-4 text-sm leading-6 text-slate-700">
                            {formatValue(propertyFile.description)}
                          </p>
                        )}
                      </article>
                    )
                  })}
                </div>
              )}
            </div>
          </details>
        </section>
      </div>
    </main>
  )
}
